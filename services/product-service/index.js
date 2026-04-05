const express = require('express');
const authMiddleware = require('./authmiddleware');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
}); 

const products = [
  { id: 1, name: "iPhone", price: 1000 },
  { id: 2, name: "Laptop", price: 2000 }
];

app.get('/products',authMiddleware, (req, res) => {
  console.log(`User ${req.user.email} accessed products`);
  res.json(products);
});

app.listen(process.env.PRODUCT_PORT,"0.0.0.0", () => {
  console.log(`Product service on port ${process.env.PRODUCT_PORT}`);
});