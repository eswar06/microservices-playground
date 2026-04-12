const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = [{ email: "eswarvinnakota06@gmail.com", password: "$2a$10$..." }];
const app = express();
const dotenv = require("dotenv");
const publishEvent = require("./publishEvent").publishEvent;
dotenv.config();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const authServiceLog = async (req, res, next) => {
  console.log(`[AUTH SERVICE] ${req.method} ${req.url}`);
  await publishEvent({
    type: "FLOW_STEP",
    flow: "LOGIN",
    step: "AUTH_SERVICE_HIT",
  });
  next();
};

app.use(authServiceLog);

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  await publishEvent({
    type: "FLOW_STEP",
    flow: "SIGNUP",
    step: "PASSWORTD_ENCRYPTION",
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ email, password: hashedPassword });

  await publishEvent({
    type: "FLOW_STEP",
    flow: "SIGNUP",
    step: "USER_CREATED",
  });

  res.json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  } else {
    await publishEvent({
      type: "FLOW_STEP",
      flow: "LOGIN",
      step: "USER_VALIDATION",
    });
    const isMatch = bcrypt.compare(password, user.password);
    if (isMatch) {
      var token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      await publishEvent({
        type: "FLOW_STEP",
        flow: "LOGIN",
        step: "TOKEN_ISSUED",
      });
      res.json({ token });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  }
});

app.listen(process.env.AUTH_PORT, "0.0.0.0", () => {
  console.log(`Auth service on port ${process.env.AUTH_PORT}`);
});
