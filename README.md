# 🚀 MICROSERVICES PLAYGROUND
### *Exposing what most backends try to hide — visually*

> Visualizing how distributed backend systems actually work — not just building them.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## 💡 Why This Project Exists

Most applications hide backend complexity behind clean UIs. This project does the opposite.

The **Microservices Playground** exposes and animates real backend behavior — turning invisible service-to-service communication, event propagation, and distributed state changes into something you can actually see and interact with in real time.

It's not an e-commerce app. It's a **developer-focused system visualization tool** built on top of a real microservices stack. Every action you take in the UI triggers actual backend flows, and every step of those flows is streamed back to the visualizer live via WebSocket.

---

## 🧱 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Next.js)                           │
│                     System Visualizer Interface                     │
└────────────────────────┬─────────────────────────┬─────────────────┘
                         │ HTTP                     │ WebSocket (live updates)
                         ▼                          ▼
          ┌──────────────────────────┐   ┌──────────────────────┐
          │       API GATEWAY        │   │    SOCKET SERVICE    │
          └───┬──────┬──────┬────┬───┘   │  (Event Stream Hub)  │
              │      │      │    │       └──────────┬───────────┘
              ▼      ▼      ▼    ▼                  │ consumes
         ┌──────┐ ┌──────┐ ┌──────┐ ┌───────┐      │
         │ Auth │ │Prod. │ │ Cart │ │Order │      │
         │ Svc  │ │ Svc  │ │ Svc  │ │ Svc  │      │
         └──┬───┘ └──────┘ └──┬───┘ └───┬──┘      │
            │                 │         │          │
            │   publishes     │         │          │
            └────────────────►└────┬────┘          │
                                   ▼               │
                         ┌───────────────────┐     │
                         │     RabbitMQ      │─────┘
                         │  Message Broker   │
                         └───────────────────┘
                              ▲         ▲
                    Cart Svc  │         │  Socket Svc
                (independently│         │independently)
                   consumes)  │         │  consumes)
```

### Key Design Point

Every service publishes events to RabbitMQ at each meaningful step. The **Socket Service** independently consumes all of these events and forwards them to the frontend via WebSocket — giving the visualizer a live, parallel view of what's happening inside the system without interfering with the domain services at all.

```
🟢  SYNCHRONOUS   ──── Client → API Gateway → Service
🟠  ASYNCHRONOUS  ──── Service → RabbitMQ → Service          (domain events)
🔵  REALTIME      ──── RabbitMQ → Socket Service → Client    (WebSocket)
```

---

## 🔹 Services

| Service | Responsibility | Protocol |
|---|---|---|
| **Auth Service** | JWT-based login & signup, password hashing | REST + AMQP |
| **Product Service** | Stateless product catalog reads | REST |
| **Cart Service** | User cart state, independent event consumer | REST + AMQP |
| **Order Service** | Order creation, domain event publisher | REST + AMQP |
| **Socket Service** | Independently consumes all RabbitMQ events, streams to frontend | AMQP + WebSocket |

---

## ⚡ Core Flows

Each flow has two parallel tracks — the **main flow** (what the system does) and the **real-time track** (how the visualizer sees it live).

---

### 🔐 Login Flow

**Main Flow**
```
Client
  └──► API Gateway
         └──► Auth Service
                ├── User validation
                ├── Token issued
                └── Session active
```

**Real-time Track** *(runs in parallel)*
```
Auth Service ──► RabbitMQ ──► Socket Service ──► WebSocket ──► UI Visualizer
```

---

### 📝 Sign-up Flow

**Main Flow**
```
Client
  └──► API Gateway
         └──► Auth Service
                ├── Password encrypted
                ├── User created
                └── User ready for login
```

**Real-time Track** *(runs in parallel)*
```
Auth Service ──► RabbitMQ ──► Socket Service ──► WebSocket ──► UI Visualizer
```

---

### 🛒 Add to Cart Flow

**Main Flow**
```
Client
  └──► API Gateway
         └──► Cart Service
                ├── Item added to user
                └── Cart updated
```

**Real-time Track** *(runs in parallel)*
```
Cart Service ──► RabbitMQ ──► Socket Service ──► WebSocket ──► UI Visualizer
```

---

### 📦 Place Order Flow

**Main Flow**
```
Client
  └──► API Gateway
         └──► Order Service
                ├── publishes order.placed event
                │       └──► RabbitMQ
                │                └──► Cart Service  (independently consumes)
                │                       └── Cart cleared for user
                └── Order placed for user
```

**Real-time Track** *(runs in parallel)*
```
Order Service ──► RabbitMQ ──► Socket Service ──► WebSocket ──► UI Visualizer
Cart Service  ──► RabbitMQ ──► Socket Service ──► WebSocket ──► UI Visualizer
```

> The Cart Service and Socket Service both independently consume from the same RabbitMQ event. The cart clears itself through the event — no direct call is made from Order Service to Cart Service. The UI visualizer sees both sides of this exchange in real time.

---

## 🎨 Frontend Philosophy

This is not a traditional UI. The frontend acts as a **System Playground & Visualization Interface**:

```
  User Action
      │
      ▼
  API Gateway ──► Services ──► RabbitMQ
                                   │
                            Socket Service
                                   │
                               WebSocket
                                   │
                            UI Visualizer
                     (Flow Animations, Service Traces,
                       Real-time State Changes)
```

Every step you trigger in the UI is reflected back through actual backend events — not mocked, not polled. Designed like a developer tool, not an e-commerce app.

---

## 🔥 Feature Highlights

- **Microservices Backend** — 5 independently-scoped Node.js/Express services
- **Event-Driven Architecture** — RabbitMQ publish/consume with real domain events
- **Real-time Visualization** — Socket Service streams live backend events to the UI via WebSocket
- **Parallel Event Track** — Every flow has a live mirror in the visualizer without coupling to domain logic
- **Independent Consumers** — Cart Service and Socket Service consume the same events without knowing about each other
- **JWT Authentication** — Stateless sessions via signed cookies
- **Dockerized Infrastructure** — Full stack spins up with a single command
- **Clean Separation of Concerns** — Each service owns its domain, data, and events

---

## 🧰 Tech Stack

| Frontend | Backend | Infrastructure |
|---|---|---|
| Next.js | Node.js | Docker |
| React 18 | Express.js | Docker Compose |
| Tailwind CSS | RabbitMQ | JWT (stateless) |
| Socket.IO Client | Socket.IO Server | bcrypt |
| | REST APIs | |

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
SOCKET_SERVICE_URL=http://localhost:3005
RABBITMQ_URL=amqp://localhost
```

**3. Start all services**
```bash
docker-compose up --build
```

All services spin up together. The visualizer is available at `http://localhost:3000`.  
The Socket Service connects automatically and begins streaming events to the UI.

---

## 🧠 Concepts Demonstrated

| Concept | How It's Shown |
|---|---|
| **Microservices Design** | 5 isolated services with independent concerns |
| **Event-Driven Systems** | RabbitMQ publish/consume across services |
| **Real-time Event Streaming** | Socket Service bridges RabbitMQ → WebSocket → UI |
| **Independent Consumers** | Cart Service and Socket Service both consume the same events without coupling |
| **Stateless Auth** | JWT in cookies, no server-side sessions |
| **Distributed State** | Cart cleared via event, not a direct API call |
| **Backend Visualization** | UI animates actual service-to-service flows live |
| **Observer Pattern** | Socket Service as a passive consumer — zero impact on domain services |

---

## 🚀 Planned Improvements

- [ ] Distributed tracing with Jaeger
- [ ] Per-service Logs Panel in the visualizer
- [ ] Service Health Dashboard
- [ ] Failure simulation — retry logic, dead-letter queues
- [ ] Replay mode — re-emit past event sequences for debugging

---

## 📸 Screenshots

*Add your screenshots here*

---

## 👨‍💻 Author

**Eswar**

Built to bridge the gap between system design theory and real implementation.
