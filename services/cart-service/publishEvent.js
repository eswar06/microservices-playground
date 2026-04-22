const amqp = require("amqplib");

async function publishEvent(event) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  // const connection = await amqp.connect("amqp://13.63.239.214");
  console.log(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  const exchange = "events";

  await channel.assertExchange(exchange, "fanout", {
    durable: false,
  });

  channel.publish(exchange, "", Buffer.from(JSON.stringify(event)));

  console.log("Event published:", event);
}

module.exports = { publishEvent };
