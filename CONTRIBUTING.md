# Contributing to Microservices Playground

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 16+
- Docker & Docker Compose
- Git

### Local Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/microservices-playground.git
   cd microservices-playground
   ```

2. **Create a development branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies** (if needed for any service)
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update .env with your local configuration
   ```

5. **Start the full stack**
   ```bash
   docker-compose up --build
   ```

6. **Verify everything is running**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:3000/api
   - Check service logs for any errors

## Code Style Guidelines

### JavaScript/Node.js
- Use **ES6+ syntax**
- Use **semicolons**
- Use **2-space indentation**
- Use **meaningful variable names**
- Add comments for complex logic

### Commit Messages
Follow conventional commits:
```
feat: add distributed tracing with Jaeger
fix: resolve race condition in Cart Service
docs: update API documentation
refactor: simplify event handler logic
test: add integration tests for Order Service
```

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore
**Scope:** Service name (auth, product, cart, order, socket) or area
**Subject:** Imperative, lowercase, no period

### Example Commit
```
feat(order): add order status tracking events

- Publish order.status.updated event
- Socket Service consumes and broadcasts
- UI visualizes state transitions

Closes #42
```

## Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Test your changes locally**
   ```bash
   docker-compose up --build
   # Manually test the feature
   ```

3. **Commit with descriptive messages**
   ```bash
   git commit -m "feat(service): description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Provide a clear title and description
   - Link related issues
   - Include screenshots/GIFs if UI changes
   - Explain the architectural impact

### PR Template Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] All services start without errors
- [ ] Tested manually with docker-compose

## Architecture & Design Principles

### Before Contributing

Please understand:
- **Event-Driven Design** — All significant state changes publish events to RabbitMQ
- **Service Independence** — Services should not directly call each other (except API Gateway → Service)
- **Stateless Services** — Use RabbitMQ for cross-service state sync
- **Observer Pattern** — Socket Service should remain a passive consumer

### When Adding a New Service

1. Create `/services/your-service/` directory
2. Implement REST API endpoints
3. Publish domain events to RabbitMQ
4. Update API Gateway routing
5. Update docker-compose.yml
6. Add service documentation in ARCHITECTURE.md

### When Adding a New Feature

1. **Identify the primary service** (auth, product, cart, order)
2. **Define the event** (e.g., `product.viewed`, `order.failed`)
3. **Implement event publishing** in the service
4. **Update Socket Service** to consume if visualization needed
5. **Test the full flow** with docker-compose
6. **Document in README** and ARCHITECTURE.md

## Testing

### Manual Testing
- Start the full stack: `docker-compose up`
- Test through the UI
- Check service logs: `docker-compose logs -f <service-name>`

### Debugging
```bash
# View specific service logs
docker-compose logs -f auth-service

# Access service directly
curl http://localhost:3001/health

# Check RabbitMQ
http://localhost:15672 (guest/guest)
```

## Reporting Issues

### Bug Reports
- Use the issue template
- Provide reproduction steps
- Include logs and screenshots
- Specify which service(s) are affected

### Feature Requests
- Describe the use case
- Explain architectural impact
- Link to related documentation

## Questions?

- Open an issue with the `question` label
- Check existing issues for similar questions
- Review ARCHITECTURE.md for system design details

---

**Thank you for contributing! 🎉**
