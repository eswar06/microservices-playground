const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authmiddleware");
const { publishEvent } = require("./publishservice");

const app = express();
app.use(express.json());

const orders = [];


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
})

app.post("/orders", authMiddleware, async (req, res) => {
  const userEmail = req.user.email;
  console.log(`Placing order for user: ${userEmail}`);
  // Fetch cart from Cart Service
  // const cartRes = await fetch("http://cart-service:3003/cart", {
  const cartRes = await fetch(process.env.CART_SERVICE_URL + "/cart", {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  console.log("Cart service response status:", cartRes);
  const cartItems = await cartRes.json();

  if (!cartItems.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const newOrder = {
    id: orders.length + 1,
    user: userEmail,
    items: cartItems,
    status: "PLACED"
  };

  orders.push(newOrder);
  try {
      console.log("Publishing event for order:", newOrder);
      await publishEvent({
        type: "ORDER_PLACED",
        data: newOrder
      });
    } catch (err) {
      console.error("Event publish failed:", err);
    }

  res.json(newOrder);
});

app.get("/orders", authMiddleware, (req, res) => {
  const userEmail = req.user.email;

  const userOrders = orders.filter(o => o.user === userEmail);

  res.json(userOrders);
});

app.listen(process.env.ORDER_PORT,"0.0.0.0", () => {
  console.log(`Order service running on port ${process.env.ORDER_PORT}`);
});