# 🚀 Microservices Playground

> Visualizing how backend systems actually work — not just building them.

An interactive fullstack system that demonstrates **microservices architecture**, **event-driven communication**, and **real-time backend flow visualization** using a custom developer-focused UI.

---

## 🎯 Project Goal

Most applications hide backend complexity.

This project does the opposite:

👉 It **exposes and visualizes backend behavior**  
👉 It helps understand **how services communicate in real systems**  
👉 It demonstrates **event-driven architecture in action**

---

## 🧱 System Architecture

The platform is built using a **microservices architecture**, where each service is independently deployed and communicates via APIs and events.

### 🔹 Services

- **Auth Service**
  - Handles user authentication (JWT-based)
  - Manages login & signup flows

- **Product Service**
  - Serves product data
  - Stateless read service

- **Cart Service**
  - Manages user cart state
  - Consumes events to update cart

- **Order Service**
  - Creates orders from cart data
  - Publishes domain events

---

## 🔗 Communication Model

### 🟢 Synchronous (REST APIs)
Used for direct service-to-service communication:

Client → API → Service

### 🟠 Asynchronous (Event-Driven)
Powered by **RabbitMQ**

```text
Order Service → (publish) → RabbitMQ → Cart Service (consume)