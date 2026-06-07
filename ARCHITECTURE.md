# Architecture

## System Overview

The Microservices Playground exposes real backend complexity through an interactive UI. It demonstrates event-driven architecture, microservices patterns, and distributed system communication in action.

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                         │
│              System Visualizer & Playground                 │
└──────────────┬────────────────────────────┬─────────────────┘
               │ HTTP REST                   │ WebSocket
               │                             │
      ┌────────▼─────────┐        ┌──────────▼──────────┐
      │   API GATEWAY    │        │  SOCKET SERVICE     │
      │  (Port 3000)     │        │  (Real-time Hub)    │
      └────┬──┬──┬──┬────┘        └──────────┬──────────┘
           │  │  │  │                        │
      ┌────▼──▼──▼──▼─────────────────────┐  │
      │      MICROSERVICES (Ports 3001+)  │  │
      │  • Auth Service (3001)             │  │
      │  • Product Service (3002)          │  │
      │  • Cart Service (3003)             │  │
      │  • Order Service (3004)            │  │
      └─────────────┬──────────────────────┘  │
                    │ publishes events        │
            ┌───────▼──────────────┐          │
            │     RABBITMQ         │          │
            │  Message Broker      │──────────┘
            │  (Event Bus)         │ consumes
            └──────────────────────┘
```

## 6 Core Services

| Service | Port | Role |
|---------|------|------|
| **API Gateway** | 3000 | Routes client requests to services |
| **Auth Service** | 3001 | JWT login/signup, password hashing (bcrypt) |
| **Product Service** | 3002 | Stateless product catalog reads |
| **Cart Service** | 3003 | Cart management, independent event consumer |
| **Order Service** | 3004 | Order creation, domain event publisher |
| **Socket Service** | 3005 | Real-time event streaming to frontend via WebSocket |

## Key Design Patterns

### 1. Event-Driven Architecture
- Services communicate via RabbitMQ, not direct calls
- Every significant action publishes an event
- Multiple services consume same events independently

### 2. Stateless Services
- No server-side session state
- JWT tokens carry authentication info
- Cross-service state sync through RabbitMQ events

### 3. Independent Event Consumers
- Cart Service consumes `order.placed` event → clears cart
- Socket Service consumes all events → broadcasts to UI
- Neither knows about the other (true decoupling)

### 4. Observer Pattern for Visualization
- Socket Service passively observes all events
- Zero impact on business logic
- Services don't know they're being monitored

## Communication Flows

### Synchronous (User Action → Response)
```
Client → API Gateway → Service → Immediate Response
```
Latency: ~50-100ms

### Asynchronous (Event Broadcasting)
```
Service → RabbitMQ → Multiple Consumers (independently)
```
Latency: ~100-500ms

### Real-time (Events to UI)
```
Service → RabbitMQ → Socket Service → WebSocket → UI
```
No polling, pure push updates

## Event Types

```javascript
// Auth Service publishes
{ type: 'user.created', userId, email, timestamp }
{ type: 'session.active', userId, token, timestamp }

// Cart Service publishes
{ type: 'cart.updated', userId, items, timestamp }

// Order Service publishes
{ type: 'order.placed', userId, orderId, items, timestamp }

// All flow to Socket Service → WebSocket → Frontend UI
```

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js, React 18, Tailwind CSS, Socket.IO Client |
| **Backend** | Node.js, Express.js, RabbitMQ, JWT, bcrypt |
| **Infrastructure** | Docker, Docker Compose |
| **Protocol** | HTTP (REST), AMQP (RabbitMQ), WebSocket |

## Key Principles

✅ **Microservices** — Each service owns its domain logic  
✅ **Event-Driven** — Services communicate through events  
✅ **Stateless** — No server-side sessions needed  
✅ **Decoupled** — Services don't know about each other  
✅ **Real-time** — WebSocket for live visualization  
✅ **Observable** — All backend flows visible in UI  

For detailed technical breakdown, see the code in `/services/` directory.
