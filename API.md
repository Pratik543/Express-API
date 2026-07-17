# API Reference & Usage Guide

A complete guide to all routes in the Express application, including request/response formats and example calls.

**Base URL (local):** `http://localhost:3000`
**API prefix:** `/api/v1`

---

## Table of Contents
- [Getting Started](#getting-started)
- [Public Root Routes](#public-root-routes)
- [Users API](#users-api)
- [Products API](#products-api)
- [Auth API](#auth-api)
- [Query Parameters (Products)](#query-parameters-products)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)
- [Example Workflows](#example-workflows)

---

## Getting Started

### Prerequisites
- Node.js 18+ (developed/tested on v24)
- npm

### Install & Run
```bash
# Install dependencies
npm install

# Development (auto-reload with nodemon)
npm run dev

# Production
npm start

# Run tests
npm test

# Lint
npm run lint
```

The server reads configuration from `.env` (see `.env.example` for all options). Default port is `3000`.

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | `development` or `production` | `development` |
| `PORT` | HTTP port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |
| `API_RATE_LIMIT_WINDOW_MS` | Rate-limit window (ms) | `900000` (15 min) |
| `API_RATE_LIMIT_MAX` | Max requests per window | `100` |
| `DATABASE_URL` | MongoDB connection string | – |
| `JWT_SECRET` | JWT signing secret | – |

---

## Public Root Routes

### GET `/`
Welcome message and API metadata.

**Response `200`**
```json
{
  "success": true,
  "message": "Welcome to the API",
  "version": "1.0.0",
  "documentation": "/api/v1/docs"
}
```

### GET `/version`
Version, build number, and timestamp.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "build": "dev",
    "timestamp": "2026-07-17T13:10:30.209Z"
  }
}
```

### GET `/health`
Server health/uptime check (useful for load-balancer probes).

**Response `200`**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-07-17T13:10:30.215Z",
  "environment": "development"
}
```

**Example**
```bash
curl http://localhost:3000/health
```

---

## Users API

Base path: `/api/v1/users`

### GET `/api/v1/users`
List all users.

**Response `200`**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "admin" }
  ]
}
```

### GET `/api/v1/users/:id`
Get a single user by ID.

**Response `200`**
```json
{ "success": true, "data": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" } }
```

**Response `404`** (not found)
```json
{ "success": false, "message": "User with ID 999 not found" }
```

### POST `/api/v1/users`
Create a new user.

**Request body**
```json
{ "name": "Alice", "email": "alice@example.com", "role": "user" }
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | ✅ | |
| email | string | ✅ | |
| role | string | ❌ | Defaults to `user` |

**Response `201`**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { "id": 3, "name": "Alice", "email": "alice@example.com", "role": "user" }
}
```

**Response `400`** (missing fields)
```json
{ "success": false, "message": "Name and email are required" }
```

### PUT `/api/v1/users/:id`
Update an existing user (partial update supported).

**Request body** (any subset of fields)
```json
{ "name": "Alice Updated", "role": "admin" }
```

**Response `200`**
```json
{ "success": true, "message": "User updated successfully", "data": { "id": 3, "name": "Alice Updated", "email": "alice@example.com", "role": "admin" } }
```

### DELETE `/api/v1/users/:id`
Delete a user.

**Response `200`**
```json
{ "success": true, "message": "User deleted successfully", "data": { "id": 3, "name": "Alice Updated", "email": "alice@example.com", "role": "admin" } }
```

---

## Products API

Base path: `/api/v1/products`

### GET `/api/v1/products`
List all products. Supports filtering via query parameters (see below).

**Response `200`**
```json
{
  "success": true,
  "count": 4,
  "data": [
    { "id": 1, "name": "Laptop", "price": 999.99, "category": "Electronics", "inStock": true },
    { "id": 2, "name": "Smartphone", "price": 699.99, "category": "Electronics", "inStock": true },
    { "id": 3, "name": "Headphones", "price": 149.99, "category": "Electronics", "inStock": false },
    { "id": 4, "name": "Desk Chair", "price": 299.99, "category": "Furniture", "inStock": true }
  ]
}
```

### GET `/api/v1/products/:id`
Get a single product by ID.

**Response `200`**
```json
{ "success": true, "data": { "id": 1, "name": "Laptop", "price": 999.99, "category": "Electronics", "inStock": true } }
```

**Response `404`**
```json
{ "success": false, "message": "Product with ID 999 not found" }
```

### POST `/api/v1/products`
Create a new product.

**Request body**
```json
{ "name": "Mouse", "price": 29.99, "category": "Electronics", "inStock": true }
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | ✅ | |
| price | number | ✅ | Must be ≥ 0 |
| category | string | ✅ | |
| inStock | boolean | ❌ | Defaults to `false` |

**Response `201`**
```json
{ "success": true, "message": "Product created successfully", "data": { "id": 5, "name": "Mouse", "price": 29.99, "category": "Electronics", "inStock": true } }
```

**Response `400`** (invalid/missing)
```json
{ "success": false, "message": "Name, price, and category are required" }
```
```json
{ "success": false, "message": "Price must be a positive number" }
```

### PUT `/api/v1/products/:id`
Update an existing product (partial update supported).

**Request body**
```json
{ "price": 25.99, "inStock": false }
```

**Response `200`**
```json
{ "success": true, "message": "Product updated successfully", "data": { "id": 5, "name": "Mouse", "price": 25.99, "category": "Electronics", "inStock": false } }
```

### DELETE `/api/v1/products/:id`
Delete a product.

**Response `200`**
```json
{ "success": true, "message": "Product deleted successfully", "data": { "id": 5, "name": "Mouse", "price": 25.99, "category": "Electronics", "inStock": false } }
```

---

## Auth API

Base path: `/api/v1/auth`

> ⚠️ **Demo only.** The auth controller uses in-memory credentials and returns a mock base64 token. For production, replace with bcrypt password hashing + JWT (see `JWT_SECRET` env var) and a real user store.

### POST `/api/v1/auth/login`
Authenticate a user and receive a token.

**Request body**
```json
{ "username": "admin", "password": "admin123" }
```

**Response `200`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "username": "admin", "role": "admin" },
    "token": "YWRtaW46MTc4NDI5MzgzMDI4Ng=="
  }
}
```

**Response `400`** (missing credentials)
```json
{ "success": false, "message": "Username and password are required" }
```

**Response `401`** (invalid credentials)
```json
{ "success": false, "message": "Invalid credentials" }
```

### POST `/api/v1/auth/logout`
Log out the current session.

**Response `200`**
```json
{ "success": true, "message": "Logout successful" }
```

### GET `/api/v1/auth/me`
Get the currently authenticated user.

**Response `200`**
```json
{ "success": true, "data": { "id": 1, "username": "admin", "role": "admin" } }
```

**Demo credentials**
| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | admin |
| `user` | `user123` | user |

---

## Query Parameters (Products)

The `GET /api/v1/products` endpoint accepts the following query string filters (combinable):

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `category` | string | `?category=Electronics` | Case-insensitive category match |
| `inStock` | boolean | `?inStock=true` | Filter by stock availability |
| `search` | string | `?search=laptop` | Substring match on product name |

**Examples**
```bash
# Only Electronics that are in stock
curl "http://localhost:3000/api/v1/products?category=Electronics&inStock=true"

# Search by name
curl "http://localhost:3000/api/v1/products?search=chair"

# Combine all three
curl "http://localhost:3000/api/v1/products?category=Furniture&inStock=true&search=desk"
```

---

## Error Responses

All errors use a consistent JSON shape:

```json
{ "success": false, "error": "Human-readable message" }
```

In **development** mode an additional `stack` field is included; it is **hidden in production**.

| Status | When | Example body |
|--------|------|--------------|
| 400 | Validation / missing fields | `{ "success": false, "message": "Name and email are required" }` |
| 401 | Auth failure | `{ "success": false, "message": "Invalid credentials" }` |
| 404 | Unknown route or resource | `{ "success": false, "error": "Not Found - /unknown" }` |
| 429 | Rate limit exceeded | `{ "success": false, "message": "Too many requests from this IP, please try again later." }` |
| 500 | Unexpected server error | `{ "success": false, "error": "Server Error" }` |

---

## Rate Limiting

All routes under `/api/` are protected by `express-rate-limit`:
- **Window:** `API_RATE_LIMIT_WINDOW_MS` (default 15 minutes)
- **Max requests:** `API_RATE_LIMIT_MAX` (default 100) per IP
- On exceed, returns `429` with a retry message.
- Public root routes (`/`, `/version`, `/health`) are **not** rate-limited.

---

## Example Workflows

### 1. Full user lifecycle
```bash
# List users
curl http://localhost:3000/api/v1/users

# Create
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@example.com"}'

# Get by ID
curl http://localhost:3000/api/v1/users/3

# Update
curl -X PUT http://localhost:3000/api/v1/users/3 \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'

# Delete
curl -X DELETE http://localhost:3000/api/v1/users/3
```

### 2. Product filtering
```bash
curl "http://localhost:3000/api/v1/products?category=Electronics&inStock=true&search=phone"
```

### 3. Authenticate then call a protected-style flow
```bash
# Login and capture token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')

echo "Token: $TOKEN"

# Get current user
curl http://localhost:3000/api/v1/auth/me

# Logout
curl -X POST http://localhost:3000/api/v1/auth/logout
```

---

## Health & Monitoring

- `GET /health` — quick liveness probe.
- Structured request logs are emitted in production (`method`, `url`, `status`, `duration`, `ip`, `userAgent`) via `src/middleware/security.js`.
- The server shuts down gracefully on `SIGTERM` / `SIGINT`, finishing in-flight requests before exiting.

---

## Notes
- In-memory data stores are used for demonstration. Restarting the server resets all users/products to their seeds.
- Wire a real database via `config/database.js` (`DATABASE_URL`) and replace the auth controller with hashed passwords + JWT for production use.
