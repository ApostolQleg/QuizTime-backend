# QuizTime Backend

Fastify + MongoDB backend API for QuizTime.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Authentication](#authentication)
- [API Specification](#api-specification)
- [Data Notes](#data-notes)
- [CORS](#cors)
- [Scripts](#scripts)
- [License](#license)
- [Authors](#authors)

## Overview

REST API for QuizTime built with Fastify and MongoDB.

The backend provides:

- JWT authentication
- Email verification codes during sign-up
- Google sign-in and account linking
- Quiz catalog with filtering/sorting/pagination
- Quiz CRUD for authenticated authors
- User profile management
- Quiz result storage and history

Frontend project:

- https://github.com/ApostolQleg/QuizTime-React

## Tech Stack

- Node.js (ES modules)
- Fastify
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Google token validation (`google-auth-library`)
- Email sending (`nodemailer`)
- Password hashing (`bcrypt`)

## Project Structure

```
.
|-- LICENSE
|-- README.md
|-- package.json
|-- vercel.json
`-- src/
        |-- index.js
        |-- config/
        |   `-- db.js
        |-- data/
        |   `-- defaultQuizzes.js
        |-- middleware/
        |   `-- checkAuth.js
        |-- models/
        |   |-- Quiz.js
        |   |-- Result.js
        |   |-- TempCode.js
        |   `-- User.js
        |-- routes/
        |   |-- authRoutes.js
        |   |-- quizRoutes.js
        |   |-- resultRoutes.js
        |   `-- userRoutes.js
        |-- services/
        |   |-- authService.js
        |   |-- quizService.js
        |   |-- resultService.js
        |   `-- userService.js
        `-- utils/
                |-- dataUtil.js
                |-- emailService.js
                |-- googleClient.js
                `-- nicknameGen.js
```

### Folder Responsibilities

- src/routes: Fastify route registration and endpoint grouping
- src/services: Business logic handlers for each route group
- src/models: Mongoose schemas and model methods
- src/middleware: Shared request guards (JWT auth)
- src/config: Infrastructure setup (database connection)
- src/data: Built-in seed data
- src/utils: Third-party integration helpers and scripts

## Requirements

- Node.js 18+
- MongoDB database (local or Atlas)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

Required for normal API operation:

| Variable           | Required | Description                                                                                                           |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `PORT`             | No       | Local server port (default: `3000`)                                                                                   |
| `MONGO_URI`        | Yes      | MongoDB connection string                                                                                             |
| `JWT_SECRET`       | Yes      | Secret used to sign and verify JWT tokens                                                                             |
| `GOOGLE_CLIENT_ID` | Yes\*    | Google OAuth client id for `/auth/google`, `/auth/google-extract`, `/auth/link-google`, and Google-based registration |
| `SMTP_USER`        | Yes\*    | SMTP username (currently used with Gmail service) for `/auth/send-code`                                               |
| `SMTP_PASS`        | Yes\*    | SMTP password/app-password for `/auth/send-code`                                                                      |
| `NODE_ENV`         | No       | If set to `production`, local listener is skipped (useful for serverless runtime)                                     |

Optional helper-script variable:

| Variable    | Used by                 | Description                                              |
| ----------- | ----------------------- | -------------------------------------------------------- |
| `AUTHOR_ID` | `src/utils/dataUtil.js` | Author/user id used by manual seed/delete utility script |

`*` Required only for features that depend on Google auth or email verification.

## Running Locally

```bash
npm start
```

Server starts at:

- `http://localhost:3000` by default

Health endpoint:

- `GET /` -> `{ status, time }`

## Authentication

Protected endpoints require:

`Authorization: Bearer <jwt_token>`

Token payload contains user id (`_id`) and is signed for 30 days.

## API Specification

Base groups:

- `/auth`
- `/api/quizzes`
- `/api/results`
- `/api/user`

### Auth Routes

| Method | Path                   | Auth | Purpose                                              |
| ------ | ---------------------- | ---- | ---------------------------------------------------- |
| `POST` | `/auth/register`       | No   | Register local or Google-backed user                 |
| `POST` | `/auth/login`          | No   | Login with `login` + `password`                      |
| `POST` | `/auth/google`         | No   | Login existing user by Google token                  |
| `POST` | `/auth/google-extract` | No   | Validate Google token and return profile for prefill |
| `POST` | `/auth/send-code`      | No   | Send 6-digit email verification code                 |
| `POST` | `/auth/link-google`    | Yes  | Attach Google account to logged-in user              |

Important request notes:

- `POST /auth/register` expects `login`, `email`, `password`, and either:
    - `code` from `/auth/send-code`, or
    - `googleToken`.
- `POST /auth/login` expects `{ login, password }`.
- `POST /auth/google`, `/auth/google-extract`, and `/auth/link-google` expect `{ token }`.
- `POST /auth/send-code` expects `{ email }`.

### Quiz Routes

| Method   | Path               | Auth | Purpose                 |
| -------- | ------------------ | ---- | ----------------------- |
| `GET`    | `/api/quizzes`     | No   | List quizzes            |
| `GET`    | `/api/quizzes/:id` | No   | Get quiz by public `id` |
| `POST`   | `/api/quizzes`     | Yes  | Create quiz             |
| `PUT`    | `/api/quizzes/:id` | Yes  | Update own quiz         |
| `DELETE` | `/api/quizzes/:id` | Yes  | Delete own quiz         |

`GET /api/quizzes` query parameters:

- `limit` (default `10`)
- `skip` (optional, takes precedence over `page`)
- `page` (default `1`, used if `skip` is missing)
- `search` (title contains, case-insensitive)
- `sort` (`newest`, `oldest`, `az`, `za`)
- `authorId` (filter quizzes by author)

Create payload shape:

- `{ id, title, description, questions }`
- `questions` must be an array.

### Result Routes

All result routes are protected.

| Method | Path               | Auth | Purpose                         |
| ------ | ------------------ | ---- | ------------------------------- |
| `GET`  | `/api/results`     | Yes  | List current user results       |
| `GET`  | `/api/results/:id` | Yes  | Get result document by Mongo id |
| `POST` | `/api/results`     | Yes  | Save quiz attempt               |

`GET /api/results` query parameters:

- `limit` (default `36`)
- `skip` (default `0`)
- `search` (quiz title contains)
- `sort` (`newest`, `oldest`, `az`, `za`)

`POST /api/results` payload:

- `{ quizId, answers, summary, timestamp }`

### User Routes

| Method   | Path                 | Auth | Purpose                         |
| -------- | -------------------- | ---- | ------------------------------- |
| `GET`    | `/api/user/:id`      | No   | Public profile by user id       |
| `GET`    | `/api/user`          | Yes  | Current user profile            |
| `PUT`    | `/api/user/update`   | Yes  | Update current user fields      |
| `POST`   | `/api/user/password` | Yes  | Change password                 |
| `DELETE` | `/api/user/delete`   | Yes  | Delete account and user results |
| `GET`    | `/api/user/nickname` | Yes  | Generate nickname suggestions   |

`PUT /api/user/update` accepts any of:

- `login`
- `nickname`
- `themeColor`
- `avatarType`

`POST /api/user/password` expects:

- `{ currentPassword, newPassword }`

## Data Notes

- Initial default quizzes are automatically inserted when the quizzes collection is empty.
- Email verification codes are stored in `temp_codes` and expire after 5 minutes (Mongo TTL).

## CORS

Allowed origins in current server config:

- `https://quiz-time-with-react.vercel.app`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Allowed methods:

- `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

## Scripts

| Command     | Description                                          |
| ----------- | ---------------------------------------------------- |
| `npm start` | Start backend (`node src/index.js`)                  |
| `npm test`  | Placeholder test script (currently exits with error) |

## License

MIT. See [LICENSE](LICENSE) for details.

## Authors

- **Oleg Bondarenko** - _Lead Developer_
    - National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute"
    - Faculty of Informatics and Computer Engineering (FIOT)
    - Group: **IM-54**
- **dimpennn** - _Partner Developer_
    - National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute"
    - Faculty of Informatics and Computer Engineering (FIOT)
    - Group: **IM-54**
