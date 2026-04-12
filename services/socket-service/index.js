const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const amqp = require("amqplib");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },


});

async function start() {
  // connect to RabbitMQ
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  const exchange = "events";

      await channel.assertExchange(exchange, "fanout", {
        durable: false,
      });

      const q = await channel.assertQueue("", { exclusive: true });
      console.log("✅ Socket service listening to queue:", q.queue);

      await channel.bindQueue(q.queue, exchange, "");
      channel.consume(q.queue, (msg) => {
        const event = JSON.parse(msg.content.toString());

        console.log("Socket received:", event);

        if (event.type === "FLOW_STEP") {
          console.log("Forwarding flow event to frontend:", event);
          io.emit("flow-event", event);
        }
      });

}

io.on("connection", (socket) => {
  console.log("⚡ Frontend connected:", socket.id);
});

server.listen(process.env.SOCKET_PORT, () => {
  console.log("🚀 Socket service running on port " + process.env.SOCKET_PORT);
  start();
});

