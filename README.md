# QuizTime Backend

High-performance REST API for QuizTime built with **Fastify** and **MongoDB**. Handles authentication, quiz management, results storage, and user profiles.

🌐 **Live Site:** [quiz-time-with-react.vercel.app](https://quiz-time-with-react.vercel.app/)  
🔗 **Frontend Repository:** [QuizTime-frontend](https://github.com/ApostolQleg/QuizTime-frontend)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [API Modules](#api-modules)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Database](#database)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [License](#license)
- [Authors](#authors)

## Overview

QuizTime Backend is a robust REST API that powers the QuizTime platform—a full-featured quiz creation and management system. It provides secure authentication, comprehensive quiz operations, result tracking, and user profile management.

## Key Features

- **Authentication System**
    - Email/password registration and login
    - Email verification codes (5-minute expiration)
    - JWT-based session management
    - Google OAuth 2.0 integration with account linking
- **Quiz Management**
    - CRUD operations for quizzes
    - Advanced filtering, sorting, and pagination
    - Bulk quiz seeding with default data
- **User Management**
    - User profiles with nicknames
    - Avatar color generation
    - Password management and hashing
    - Account deletion
- **Results & Analytics**
    - Quiz result storage
    - Historical result tracking
    - Per-user result retrieval with pagination
- **Security & Performance**
    - Rate limiting on all routes
    - CORS configuration for production/development
    - Password hashing with bcrypt
    - Secure JWT tokens
    - Database connection pooling

## Tech Stack

- **Runtime:** Bun (ES modules)
- **Framework:** Fastify 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken), Google Auth Library
- **Email:** Nodemailer
- **Security:** bcrypt, rate limiting
- **Code Quality:** Biome (linting)
- **Testing:** Bun native testing, mongodb-memory-server

## Project Structure

```
src/
├── app/                          # Application bootstrap
│   ├── app.js                   # Fastify app setup, plugins, CORS
│   ├── server.js                # Server entrypoint
│   └── http/
│       └── router.js            # Route registration
├── infrastructure/              # External services
│   ├── db/
│   │   └── db.js               # MongoDB connection
│   ├── email/
│   │   └── email.service.js    # Email sending via Nodemailer
│   └── google/
│       └── googleClient.js     # Google OAuth validation
├── modules/                     # Feature modules (Domain-driven)
│   ├── auth/
│   │   ├── auth.routes.js      # Route definitions
│   │   ├── controllers/         # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # Data access
│   │   ├── schemas/            # Request validation
│   │   └── errors/             # Auth-specific errors
│   ├── users/                  # User management
│   ├── quizzes/                # Quiz CRUD & operations
│   └── results/                # Result storage & retrieval
├── data/
│   ├── defaultQuizzes.js       # Seed data
│   └── quizSeed.js             # Seeding logic
├── errors/
│   └── domain-error.js         # Base error class
├── plugins/
│   └── error-handler.js        # Global error handling
└── shared/
    ├── middleware/
    │   └── checkAuth.js        # JWT verification middleware
    └── utils/
        ├── dataUtil.js         # Data transformation helpers
        ├── memoizer.js         # Result caching
        └── nicknameGen.js      # Nickname generation
```

## Prerequisites

- **Node.js/Bun:** Bun runtime installed
- **MongoDB:** Local or Atlas instance
- **Gmail Account:** For email verification (or SMTP service)
- **Google OAuth Credentials:** For Google sign-in
- **Git:** For version control

## Installation

1. **Clone the repository**

    ```bash
    git clone <repo-url>
    cd QuizTime-backend
    ```

2. **Install dependencies**

    ```bash
    bun install
    ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) section)

    ```bash
    cp .env.example .env  # if available
    # Then edit .env with your credentials
    ```

4. **Verify the setup**
    ```bash
    bun run lint
    ```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database (Required)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quiztime

# JWT (Required)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Email Service (Required for registration)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Google OAuth (Required for Google login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Optional
PORT=3000                          # Defaults to 3000
NODE_ENV=development
AUTHOR_ID=your-author-id-for-seeds
```

**Important Notes:**

- **MONGO_URI:** MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **JWT_SECRET:** Generate with `openssl rand -base64 32` (min 32 characters)
- **SMTP credentials:** Gmail requires App Passwords ([setup guide](https://support.google.com/accounts/answer/185833))
    - Alternative: Use any SMTP provider (SendGrid, Mailgun, etc.)
- **GOOGLE_CLIENT_ID:** From [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 Credentials

## Running Locally

```bash
# Development mode
bun run start

# Watch mode (requires Bun file watcher)
bun --watch src/app/server.js
```

The API will be available at `http://localhost:3000`

## Available Scripts

```bash
bun run start          # Start the server
bun run test           # Run all tests once
bun run test:watch     # Run tests in watch mode
bun run lint           # Lint code with Biome
```

## API Modules

### Authentication (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/send-code` - Send verification email code
- `POST /auth/login` - Login with email/password
- `POST /auth/google` - Login/register with Google OAuth token
- `POST /auth/google-extract` - Extract data from Google token (before linking)
- `POST /auth/link-google` - Link existing account with Google (auth required)

### Quizzes (`/api/quizzes`)

- `GET /api/quizzes` - List all quizzes with pagination, sorting, filtering
    - Query params: `skip`, `limit`, `search`, `sort`, `authorId`
- `GET /api/quizzes/:id` - Get single quiz by ID
- `POST /api/quizzes` - Create new quiz (auth required)
- `PUT /api/quizzes/:id` - Update quiz (auth required, owner only)
- `DELETE /api/quizzes/:id` - Delete quiz (auth required, owner only)

### Results (`/api/results`)

- `GET /api/results` - List current user's results (auth required)
    - Query params: `skip`, `limit`, `search`, `sort`
- `GET /api/results/:id` - Get result details by ID
- `POST /api/results` - Save quiz attempt result (auth required)

### Users (`/api/user`)

- `GET /api/user/` - Get current user profile (auth required)
- `GET /api/user/:id` - Get public user profile by ID
- `PUT /api/user/update` - Update current user profile (auth required)
- `POST /api/user/password` - Change password (auth required)
- `GET /api/user/nickname` - Get suggested nicknames (auth required)
- `DELETE /api/user/delete` - Delete account permanently (auth required)

## Authentication

**JWT Flow:**

1. User registers/logs in
2. Server sends verification code via email
3. User verifies code, receives JWT token
4. Token included in `Authorization: Bearer <token>` header
5. Middleware validates token on protected routes

**Middleware:** `checkAuth.js` validates JWT on protected routes

## Deployment

### Vercel

The project includes `vercel.json` for Vercel deployment:

```bash
vercel deploy
```

**Vercel Configuration:**

- Builds from `src/app/app.js`
- Routes all requests to the Fastify app
- Set environment variables in Vercel dashboard

### Environment Setup on Vercel

Add these environment variables in Vercel project settings:

- `MONGO_URI`
- `JWT_SECRET`
- `SMTP_USER` / `SMTP_PASS`
- `GOOGLE_CLIENT_ID`
- `FRONTEND_URL` (production URL)

## Database

**MongoDB with Mongoose:**

- Connection pooling (maxPoolSize: 10)
- Automatic re-connection on failure
- Models: User, Quiz, Result, TempCode
- Indexed fields for performance

**Seeding:**

- Default quizzes automatically seeded on first run
- Prevents duplicates with uniqueness checks

## Rate Limiting

- **Global rate limit:** Configurable per route
- **Purpose:** Prevent abuse and ensure API stability
- **Implementation:** `@fastify/rate-limit` plugin

## Error Handling

**Custom Error Class:** `DomainError`

```javascript
// Example
throw new DomainError("User not found", "NOT_FOUND", 404);
```

**Global Error Handler Plugin:** Catches all errors and returns standardized responses

## Testing

```bash
# Run tests once
bun run test

# Watch mode
bun run test:watch
```

Tests include:

- Integration tests in `test/api.integration.test.js`
- MongoDB Memory Server for isolated testing

## License

MIT - See LICENSE file

## Authors

- **Oleg Bondarenko** - _Lead Developer_
    - National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute"
    - Faculty of Informatics and Computer Engineering (FIOT)
    - Group: **IM-54**
- **dimpennn** - _Partner Developer_
    - National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute"
    - Faculty of Informatics and Computer Engineering (FIOT)
    - Group: **IM-54**
