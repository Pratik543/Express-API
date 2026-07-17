# Express App - Production Ready API

A production-ready Node.js Express application with multiple routes, built with security best practices and modern development patterns.

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

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Welcome message |
| `/version` | GET | API version info |
| `/health` | GET | Health check endpoint |
| `/api/v1/docs` | GET | Interactive HTML API documentation (rendered from `API.md`) |

### API Routes (v1)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/v1/users` | GET | Get all users |
| `/api/v1/users/:id` | GET | Get user by ID |
| `/api/v1/users` | POST | Create new user |
| `/api/v1/users/:id` | PUT | Update user |
| `/api/v1/users/:id` | DELETE | Delete user |
| `/api/v1/products` | GET | Get all products (supports filtering) |
| `/api/v1/products/:id` | GET | Get product by ID |
| `/api/v1/products` | POST | Create new product |
| `/api/v1/products/:id` | PUT | Update product |
| `/api/v1/products/:id` | DELETE | Delete product |
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/auth/logout` | POST | User logout |
| `/api/v1/auth/me` | GET | Get current user |

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

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `CORS_ORIGIN` | Allowed CORS origin | * |
| `API_RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 |
| `API_RATE_LIMIT_MAX` | Max requests per window | 100 |
| `DATABASE_URL` | MongoDB connection string | - |
| `JWT_SECRET` | JWT secret key | - |

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

## License

MIT
