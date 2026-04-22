const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authmiddleware");
const app = express();
const amqp = require("amqplib");
const dotenv = require("dotenv");
const { publishEvent } = require("./publishEvent");
dotenv.config();
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // important for cookies
  })
);


app.use(express.json());

// In-memory cart store
const carts = {};

async function consumeEvents() {
  const MAX_RETRIES = 10;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log("Connecting to RabbitMQ...");
      console.log("Using RabbitMQ URL:", process.env.RABBITMQ_URL);
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      // const connection = await amqp.connect("amqp://13.63.239.214");
      const channel = await connection.createChannel();

      const exchange = "events";

      await channel.assertExchange(exchange, "fanout", {
        durable: false,
      });
       console.log("Connected to RabbitMQ ✅");

      const q = await channel.assertQueue("", { exclusive: true });

      await channel.bindQueue(q.queue, exchange, "");
      channel.consume(q.queue, async (msg) => {
        
        const event = JSON.parse(msg.content.toString());
        if (event.step === "EVENT_PUBLISHED") {
          const userEmail = event?.data?.user;
          carts[userEmail] = [];
          console.log("Cart cleared for:", userEmail);
          await publishEvent({
            type: "FLOW_STEP",
            flow: "PLACE_ORDER",
            step: "STATE_UPDATED",
          });
        }
        console.log("Cart received:", event);
      });

      break; // exit loop after success

    } catch (err) {
      retries++;
      console.log(`Retry ${retries}: RabbitMQ not ready...`);

      await new Promise(res => setTimeout(res, 5000)); // wait 5s
    }
  }

  if (retries === MAX_RETRIES) {
    console.error("Failed to connect to RabbitMQ ❌");
  }
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/cart", authMiddleware, (req, res) => {
   const userEmail = req.user.email;
   console.log(`Fetching cart for user: ${userEmail}`);
   console.log(`Current cart for ${userEmail}:`, carts[userEmail] || []);
   res.json(carts[userEmail] || [])
});

app.post("/cart/add", authMiddleware, async (req, res) => {
    await publishEvent({
      type: "FLOW_STEP",
      flow: "PRODUCT_ADD",
      step: "CART_SERVICE_RECEIVED",
    });
    console.log(`Adding item to cart for user: ${req.user.email}`);
    const userEmail = req.user.email;
    const { productId, quantity } = req.body;
    if(!carts[userEmail]){
        carts[userEmail] = [];
    }
    // carts[userEmail].push({ productId, quantity });
    await publishEvent({
      type: "FLOW_STEP",
      flow: "PRODUCT_ADD",
      step: "ITEMS_ADDED",
    });
    const existingItemIndex = carts[userEmail].findIndex(item => item.productId === productId);

    if(existingItemIndex >= 0){
        carts[userEmail][existingItemIndex].quantity += quantity;
    } else {
        carts[userEmail].push({ productId, quantity });
    }
    console.log(`Current cart for ${userEmail}:`, carts[userEmail]);
    await publishEvent({
      type: "FLOW_STEP",
      flow: "PRODUCT_ADD",
      step: "CART_UPDATED",
    });
    res.json({ message: "Item added to cart" });

});

app.delete("/cart/remove", authMiddleware, (req, res) => {
    const userEmail = req.user.email;
    const { productId } = req.body;
    if(carts[userEmail]){
        carts[userEmail] = carts[userEmail].filter(item => item.productId !== productId);
        res.json({ message: "Item removed from cart" });
    } else {
        res.status(404).json({ message: "Item not found in cart" });
    }
});

app.listen(process.env.CART_PORT,"0.0.0.0", () => {
  console.log(`Cart service running on port ${process.env.CART_PORT}`);
  consumeEvents();
});