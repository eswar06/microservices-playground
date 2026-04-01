<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║         🚀  M I C R O S E R V I C E S  P L A Y G R O U N D         ║
║      Exposing what most backends try to hide — visually      ║
╚══════════════════════════════════════════════════════════════╝
```

**Visualizing how distributed backend systems actually work — not just building them.**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 💡 Why This Project Exists

> Most applications hide backend complexity behind clean UIs.  
> **This project does the opposite.**

The Microservices Playground **exposes and animates** real backend behavior — turning invisible service-to-service communication, event propagation, and distributed state changes into something you can actually *see* and interact with.

It's not an e-commerce app. It's a **developer-focused system visualization tool** built on top of a real microservices stack.

---

## 🧱 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Next.js)                    │
│              System Visualizer Interface                │
└────────────────────────┬────────────────────────────────┘
                         │  HTTP
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      API GATEWAY                        │
└──────┬──────────┬──────────────┬───────────────┬────────┘
       │          │              │               │
       ▼          ▼              ▼               ▼
  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────────┐
  │  Auth   │ │ Product │ │   Cart   │ │    Order    │
  │ Service │ │ Service │ │ Service  │ │   Service   │
  └────┬────┘ └─────────┘ └────┬─────┘ └──────┬──────┘
       │                       │               │
       ▼                       │    ┌──────────┘
     [DB]                      │    │   AMQP Events
                               │    ▼
                         ┌─────────────────┐
                         │    RabbitMQ     │
                         │  Message Broker │
                         └─────────────────┘
```

---

## 🔹 Services

| Service | Responsibility | Protocol |
|---|---|---|
| **Auth Service** | JWT-based login & signup, password hashing | REST |
| **Product Service** | Stateless product catalog reads | REST |
| **Cart Service** | User cart state, event consumer | REST + AMQP |
| **Order Service** | Order creation, domain event publisher | REST + AMQP |

---

## 🔗 Communication Model

```
🟢  SYNCHRONOUS  ──── Client → API Gateway → Service
🟠  ASYNCHRONOUS ──── Order Service → RabbitMQ → Cart Service
```

The async layer enables **loose coupling** between services — state changes propagate through events, not direct calls.

---

## ⚡ Core Flows

<details>
<summary><b>🛍 Add to Cart Flow</b></summary>

```
Client
  │
  ▼  POST /cart/add
API Gateway
  │
  ▼
Cart Service ──── persists item ────► [Cart DB]
  │
  ▼  publishes event
RabbitMQ
  │
  ▼  consumes event
Order Service ──── updates order preview
```

</details>

<details>
<summary><b>📦 Place Order Flow</b></summary>

```
Client
  │
  ▼  POST /orders
API Gateway
  │
  ▼
Order Service
  │
  ├──► fetches cart ──► Cart Service ──► [Cart DB]
  │
  ├──► creates order ──► [Orders DB]
  │
  ▼  publishes ORDER_PLACED
RabbitMQ
  │
  ▼  consumes event
Cart Service ──── clears cart ────► [Cart DB]
```

</details>

<details>
<summary><b>🔐 Authentication Flow</b></summary>

```
           LOGIN                          SIGNUP
             │                              │
    POST /auth/login           POST /auth/signup
             │                              │
             ▼                              ▼
        Auth Service                  Auth Service
             │                              │
             ▼                              ▼
      Validate Credentials          Hash Password (bcrypt)
             │                              │
             ▼                              ▼
          [User DB]                      [User DB]
             │                              │
             ▼                              ▼
       Sign JWT Token                 User Created ✓
             │
             ▼
    Set Secure Cookie
             │
             ▼
      Access Granted ✓
```

</details>

---

## 🎨 Frontend Philosophy

This is **not** a traditional UI.

The frontend acts as a **System Playground & Visualization Interface**:

```
  User Action  ──►  triggers  ──►  Backend Services
       │                                  │
       │         visualized as            │
       └──────────────────────────────────┘
                Flow Animations
              Service-to-Service Traces
              Real-time State Changes
```

> Designed like a **developer tool**, not an e-commerce app.

---

## 🔥 Feature Highlights

- **Microservices Backend** — 4 independently-scoped Node.js/Express services
- **Event-Driven Architecture** — RabbitMQ publish/consume with real domain events
- **JWT Authentication** — Stateless sessions via signed cookies
- **System Flow Visualizer** — UI-driven backend tracing and animation
- **Dockerized Infrastructure** — Full stack runs with a single command
- **Clean Separation of Concerns** — Each service owns its domain, data, and events

---

## 🧰 Tech Stack

```
Frontend          Backend           Infrastructure
─────────         ──────────        ──────────────
Next.js           Node.js           Docker
React 18          Express.js        Docker Compose
Tailwind CSS      RabbitMQ          JWT (stateless)
                  REST APIs         bcrypt
```

---

## 🐳 Running the Project

**1. Clone the repository**
```bash
git clone https://github.com/your-username/microservices-playground.git
cd microservices-playground
```

**2. Configure environment variables**
```bash
# Create a .env file at project root
PRODUCT_SERVICE_URL=http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3001
CART_SERVICE_URL=http://localhost:3003
ORDER_SERVICE_URL=http://localhost:3004
RABBITMQ_URL=amqp://localhost
```

**3. Start all services**
```bash
docker-compose up --build
```

All services spin up together. The visualizer is available at `http://localhost:3000`.

---

## 🧠 Concepts Demonstrated

| Concept | How It's Shown |
|---|---|
| Microservices Design | 4 isolated services with independent concerns |
| Event-Driven Systems | RabbitMQ publish/consume across services |
| Stateless Auth | JWT in cookies, no server-side sessions |
| Distributed State | Cart cleared via event, not direct API call |
| Backend Visualization | UI animates real service-to-service flows |
| Loose Coupling | Services interact through events, not tight references |

---

## 🚀 Planned Improvements

- [ ] Real-time event streaming via **WebSockets**
- [ ] Distributed tracing with **Jaeger**
- [ ] Per-service **Logs Panel** in the visualizer
- [ ] **Service Health Dashboard**
- [ ] Failure simulation — retry logic, dead-letter queues

---

## 📸 Screenshots

> _Add your screenshots here_

---

<div align="center">

## 👨‍💻 Author

**Eswar**

_Built to bridge the gap between system design theory and real implementation._

---

```
If this helped you understand backend systems better —
⭐ Star the repo and explore the flows!
```

</div>