# Express App - Production Ready API

A production-ready Node.js Express application with multiple routes, built with security best practices and modern development patterns.
The app runs as a multi-stage node:22-alpine image with 5 api-service replicas load-balanced by a Caddy reverse proxy. Traefik acts as the edge gateway with automatic HTTPS (Let's Encrypt ACME), HTTP→HTTPS redirection, and a dashboard, while Dozzle provides live Docker container log streaming.

![User Flow](./images(deployed)/user-flow.png)
![System Design](./images(deployed)/system-design.png)

- Project A domain goes to traefik docker container which will be publicly exposed
- Then traefik checks which project / subdomain is requested , in case of project a it will load balance to project 'a' caddy server container where 4 replicas of node project is running
- Then Caddy reverse proxy points the request to our internal node application 

## Application Images

![Docker Containers](./images(deployed)/server's-docker-containers.png)
![API Documentation Page](./images(deployed)/0.docs-route.png)
![Dozzle Logging Dashboard](./images(deployed)/5.dozzle-dashboard.png)

## Features

- ✅ Multiple RESTful API routes
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Request logging
- ✅ Error handling
- ✅ Graceful shutdown
- ✅ Environment configuration
- ✅ Compression enabled
- ✅ Health check endpoints
- ✅ Input validation
- ✅ Interactive API docs at `/api/v1/docs`

## Routes

### Public Routes

| Route          | Method | Description                                                 |
| -------------- | ------ | ----------------------------------------------------------- |
| `/`            | GET    | Welcome message                                             |
| `/version`     | GET    | API version info                                            |
| `/health`      | GET    | Health check endpoint                                       |
| `/api/v1/docs` | GET    | Interactive HTML API documentation (rendered from `API.md`) |

### API Routes (v1)

| Route                  | Method | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| `/api/v1/users`        | GET    | Get all users                         |
| `/api/v1/users/:id`    | GET    | Get user by ID                        |
| `/api/v1/users`        | POST   | Create new user                       |
| `/api/v1/users/:id`    | PUT    | Update user                           |
| `/api/v1/users/:id`    | DELETE | Delete user                           |
| `/api/v1/products`     | GET    | Get all products (supports filtering) |
| `/api/v1/products/:id` | GET    | Get product by ID                     |
| `/api/v1/products`     | POST   | Create new product                    |
| `/api/v1/products/:id` | PUT    | Update product                        |
| `/api/v1/products/:id` | DELETE | Delete product                        |
| `/api/v1/auth/login`   | POST   | User login                            |
| `/api/v1/auth/logout`  | POST   | User logout                           |
| `/api/v1/auth/me`      | GET    | Get current user                      |

### Query Parameters for Products

- `category` - Filter by category
- `inStock` - Filter by stock status (true/false)
- `search` - Search by name

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd express-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

## Development

```bash
# Run in development mode (with nodemon)
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Production

```bash
# Start the server
npm start

# Or with PM2
pm2 start src/server.js --name "express-app"
```

# Deployment

This project runs as three separate Docker Compose stacks that share Docker networks so Traefik can route traffic to each service:

| Stack       | File                             | Purpose                                                    |
| ----------- | -------------------------------- | ---------------------------------------------------------- |
| API Gateway | `docker-compose.api-gateway.yml` | Traefik reverse proxy, TLS termination, ACME cert issuance |
| Server      | `docker-compose.server.yml`      | Main application (`api-service`) behind Caddy              |
| Logs        | `docker-compose.logs.yml`        | Dozzle log viewer behind nginx                             |

Traefik must be started **first**, since the other stacks join its Docker networks and rely on it for routing and TLS.

## Prerequisites

- Docker and Docker Compose installed on the host
- DNS A records pointing to the server's public IP for:
  - `devopschamp.site`
  - `logs.devopschamp.site`
- Ports `80` and `443` open and reachable from the internet (required for the Let's Encrypt HTTP-01 challenge)

## Networks

The stacks communicate over three external/shared Docker networks:

- `traefik` — internal to the gateway stack
- `project-a-network` — shared between the gateway and the server stack
- `traefik-dozzle` — shared between the gateway and the logs stack

These networks are created automatically the first time the gateway stack runs, since it declares them by name. The server and logs stacks reference `project-a-network` and `traefik-dozzle` as `external: true`, so the gateway stack must be deployed first.

## Docker Compose Deployment order

### 1. API Gateway (Traefik)

```bash
docker compose -f docker-compose.api-gateway.yml up -d
```

This starts Traefik, listening on ports `80` and `443`, and creates the shared networks. It also handles automatic HTTPS certificate issuance via Let's Encrypt for any service with the correct labels.

Verify Traefik is healthy:

```bash
docker logs traefik-traefik-1
```

Optional: the Traefik dashboard is enabled (`--api.dashboard=true`) but currently has no `Host()` rule configured on its router, so it isn't exposed externally by default.

### 2. Server application

```bash
docker compose -f docker-compose.server.yml up -d
```

Starts `api-service` (5 replicas) and a Caddy front proxy, routed by Traefik at `https://devopschamp.site`.

### 3. Logs (Dozzle)

```bash
docker compose -f docker-compose.logs.yml up -d
```

Starts Dozzle behind nginx, routed by Traefik at `https://logs.devopschamp.site`. Dozzle reads container logs via the mounted Docker socket (`/var/run/docker.sock`), so it can see logs for all containers on the host, not just this stack.

## TLS certificates

Certificates are issued automatically by Traefik using the `cert-resolver` ACME resolver defined in the gateway stack (HTTP-01 challenge on the `web` entrypoint). Certificates are persisted to `./certificates/letsencrypt/acme.json` on the gateway host.

Notes:

- `acme.json` must be a **file**, not a directory, and must be `chmod 600`.
- If a certificate fails to issue, check `docker logs` on the Traefik container for `acme` errors before retrying — repeated failed attempts can hit Let's Encrypt rate limits.

## Useful commands

```bash
# Bring everything down (per stack)
docker compose -f docker-compose.api-gateway.yml down
docker compose -f docker-compose.server.yml down
docker compose -f docker-compose.logs.yml down

# Tail Traefik logs
docker logs -f traefik-traefik-1

# Check which networks exist
docker network ls

# Force cert re-issuance (after fixing acme.json)
rm -f ./certificates/letsencrypt/acme.json
touch ./certificates/letsencrypt/acme.json
chmod 600 ./certificates/letsencrypt/acme.json
docker compose -f docker-compose.api-gateway.yml restart traefik
```

## Redeploying after code changes

For the server stack, rebuild the image before recreating containers:

```bash
docker compose -f docker-compose.server.yml up -d --build
```

The logs and gateway stacks use upstream images (`dozzle`, `nginx`, `traefik`) and don't require a build step — `docker compose pull` followed by `up -d` is enough to update them.

## Environment Variables

| Variable                   | Description                          | Default     |
| -------------------------- | ------------------------------------ | ----------- |
| `NODE_ENV`                 | Environment (development/production) | development |
| `PORT`                     | Server port                          | 3000        |
| `CORS_ORIGIN`              | Allowed CORS origin                  | *           |
| `API_RATE_LIMIT_WINDOW_MS` | Rate limit window (ms)               | 900000      |
| `API_RATE_LIMIT_MAX`       | Max requests per window              | 100         |
| `DATABASE_URL`             | MongoDB connection string            | -           |
| `JWT_SECRET`               | JWT secret key                       | -           |

## API Usage Examples

### Get all users

```bash
curl http://localhost:3000/api/v1/users
```

### Get user by ID

```bash
curl http://localhost:3000/api/v1/users/1
```

### Create a user

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Get products with filters

```bash
# Filter by category
curl http://localhost:3000/api/v1/products?category=Electronics

# Filter by stock status
curl http://localhost:3000/api/v1/products?inStock=true

# Search products
curl http://localhost:3000/api/v1/products?search=laptop
```

### Health check

```bash
curl http://localhost:3000/health
```

## Security Features

- Rate limiting to prevent abuse
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- CORS configuration
- Request body size limits
- Compression for performance

## Project Structure

```
├── config/
│   └── database.js
├── src/
│   ├── controllers/
│   │   ├── homeController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── authController.js
│   │   └── healthController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── security.js
│   ├── routes/
│   │   ├── api.js
│   │   ├── home.js
│   │   ├── users.js
│   │   ├── products.js
│   │   └── auth.js
│   ├── utils/
│   │   ├── response.js
│   │   └── asyncResponse.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Error Handling

The application includes comprehensive error handling:

- 404 Not Found for invalid routes
- 500 Internal Server Error for unexpected errors
- Detailed error messages in development mode
- Stack traces hidden in production

## Graceful Shutdown

The server handles graceful shutdown on SIGTERM and SIGINT signals, ensuring:
- Existing connections are completed
- Database connections are closed
- Resources are properly released

## 🤝 **Connect with Me**

Let's connect and discuss DevOps!  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pratik-k-gupta/)  

## License

MIT
