🚀 Microservices Playground

Visualizing how backend systems actually work — not just building them.

An interactive fullstack system that demonstrates microservices architecture, event-driven communication, and real-time backend flow visualization using a custom developer-focused UI.

🎯 Project Goal

Most applications hide backend complexity.

This project does the opposite:

👉 It exposes and visualizes backend behavior
👉 It helps understand how services communicate in real systems
👉 It demonstrates event-driven architecture in action

🧱 System Architecture

The platform is built using a microservices architecture, where each service is independently deployed and communicates via APIs and events.

🔹 Services
Auth Service
Handles user authentication (JWT-based) and manages login & signup flows
Product Service
Serves product data as a stateless read service
Cart Service
Manages user cart state and consumes events
Order Service
Creates orders and publishes domain events
🔗 Communication Model
🟢 Synchronous (REST APIs)

Client → API → Service

🟠 Asynchronous (Event-Driven - RabbitMQ)

Order Service → RabbitMQ → Cart Service

This enables loose coupling, scalability, and real-world event simulation.

⚡ Core Flows Implemented
🛍 Add to Cart Flow

Client
↓
API Gateway
↓
Cart Service
↓
RabbitMQ (event published)
↓
Order Service

📦 Place Order Flow

Client
↓
API Gateway
↓
Order Service
↓ (fetch cart)
Cart Service
↓
Order Created
↓
RabbitMQ (ORDER_PLACED)
↓
Cart Service (consumer)
↓
Cart Cleared

🔐 Authentication Flow

Login
Client → API → Auth Service → DB → JWT → Cookie → Access Granted

Signup
Client → API → Auth Service → Password Hash → DB Write → User Created

🎨 Frontend Philosophy

This is NOT a traditional UI.

Instead, it acts as a:

👉 System Playground / Visualization Interface

Key Concepts
User actions trigger backend services
UI visualizes service-to-service communication
Flow animations represent real system behavior
Designed like a developer tool (not ecommerce UI)
🔥 Key Features
Microservices-based backend (Node.js + Express)
Event-driven architecture using RabbitMQ
JWT Authentication (stateless sessions)
System Flow Visualizer (UI-based backend tracing)
Dockerized services with Docker Compose
Clean separation of concerns across services
🧰 Tech Stack
Frontend
Next.js (App Router)
React 18
Tailwind CSS
Backend
Node.js
Express.js
RabbitMQ
Infrastructure
Docker
Docker Compose
🐳 Running the Project
1. Clone the repo

git clone https://github.com/your-username/microservices-playground.git

cd microservices-playground

2. Setup environment variables

Create a .env file:

PRODUCT_SERVICE_URL=http://localhost:3002

AUTH_SERVICE_URL=http://localhost:3001

CART_SERVICE_URL=http://localhost:3003

ORDER_SERVICE_URL=http://localhost:3004

RABBITMQ_URL=amqp://localhost

3. Start all services

docker-compose up --build

🧠 Key Learnings & Concepts Demonstrated
Microservices architecture design
Service-to-service communication
Event-driven systems (publish/consume pattern)
Distributed system thinking
Stateless authentication using JWT
Backend flow visualization using frontend
🚀 Future Improvements
Real-time event streaming via WebSockets
Distributed tracing (like Jaeger)
Logs panel for each service
Service health monitoring dashboard
Failure simulation (retry, dead-letter queues)
📸 Screenshots

Add screenshots here:






💡 Why This Project Stands Out

Unlike typical CRUD apps, this project focuses on:

How systems behave internally
How services communicate
How events drive state changes

👉 It bridges the gap between system design theory and real implementation

👨‍💻 Author

Eswar

⭐ If you found this useful

Give it a star ⭐ and explore the system flows!
