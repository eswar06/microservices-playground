const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = [{ email: "eswarvinnakota06@gmail.com", password: "$2a$10$..." }];
const app = express();
const dotenv = require("dotenv");
const publishEvent = require("./publishEvent").publishEvent;
const cors = require("cors");
const { checkUserExists } = require("./utils/util");
dotenv.config();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // important for cookies
  })
);

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
  console.log("Signup request received");
  const { email, password } = req.body;

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

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

  await publishEvent({
    type: "FLOW_STEP",
    flow: "SIGNUP",
    step: "READY_FOR_LOGIN",
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

      await publishEvent({
          type: "FLOW_STEP",
          flow: "LOGIN",
          step: "SESSION_ACTIVE",
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
