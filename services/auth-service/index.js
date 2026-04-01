const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = [{email: "eswarvinnakota06@gmail.com", password: "$2a$10$..."}];
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Auth Service Running");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ email, password: hashedPassword });

  res.json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if(!user){
    return res.status(400).json({ message: "Invalid credentials" });
  }else{
    const isMatch = bcrypt.compare(password,user.password)
    if(isMatch){
      var token = jwt.sign({ email }, "secretkey", { expiresIn: "1h" });
      res.json({ token });
    }else{
      res.status(400).json({ message: "Invalid credentials" });
    }
  }
})

app.listen(3001, () => {
  console.log("Auth service on port 3001");
});