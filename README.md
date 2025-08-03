# TS-Mongodb-BoilerPlate

A TypeScript Express boilerplate with MongoDB, environment validation, logging, and Docker support.

## Features

- TypeScript + Express.js
- MongoDB (Mongoose)
- Environment variable validation with Joi
- Winston logger (separate files for error, warning, success, untracked logs)
- Docker & Docker Compose support
- Prettier and ESLint setup

## Getting Started

### Prerequisites

- Node.js >= 20.x
- Docker & Docker Compose (optional, for containerization)

### Installation

```sh
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your_jwt_secret_here
```

### Development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Start (Production)

```sh
npm start
```

### Lint & Format

```sh
npm run lint
npm run lint:fix
npm run prettier
```

### Docker

Build and run with Docker Compose:

```sh
docker-compose up --build
```

## API

- `GET /health` — Health check endpoint
- `GET /help` — API help/info

## Logging

Logs are stored in the `logs/` directory:
- `error.logs`
- `warning.logs`
- `success.logs`
-