---
next: false
prev:
  text: "Connectors"
  link: "/docs/integration/connectors/python"
---

# API Reference

This document provides comprehensive information about the License API endpoints, request/response formats, and authentication mechanisms.

## Authentication

The API uses JWT (JSON Web Token) based authentication with Bearer tokens.

### Token Format
All authenticated requests must include the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- Default token expiration: 30 minutes
- Configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` environment variable

## Endpoints

### Authentication

#### Register User
Creates a new user account.

**Endpoint:** `POST /auth/reg`

**Request Body:**
```json
{
  "telegram_id": "string",
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "telegram_id": "string",
  "username": "string",
  "password": "string (hashed)",
  "hwid": "not_linked",
  "is_banned": false
}
```

**Status Codes:**
- `200`: User created successfully
- `400`: Invalid request data
- `500`: Server error

**Notes:**
- Passwords are automatically hashed using bcrypt
- HWID is set to "not_linked" by default
- New users are not banned by default
- **Security Warning:** This endpoint should preferably be called from server-side applications (SSR websites, Telegram bots) to prevent HTTP sniffing

---

#### Login User
Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:** (Form Data)
```
username: string
password: string
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

**Status Codes:**
- `200`: Login successful
- `401`: Invalid credentials
- `400`: Invalid request format

**JWT Token Payload:**
The returned token contains:
- `sub`: telegram_id
- `username`: username
- `hwid`: hardware ID
- `is_banned`: ban status
- `exp`: expiration timestamp

---

### User Management

#### Get Current User
Retrieves information about the currently authenticated user.

**Endpoint:** `GET /users/me/`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "telegram_id": "string",
  "username": "string",
  "is_banned": false,
  "hwid": "string"
}
```

**Status Codes:**
- `200`: Success
- `401`: Invalid or expired token
- `400`: User is banned

---

#### Link Hardware ID
Links a hardware ID to the current user's account.

**Endpoint:** `PATCH /users/hwid`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "value": "string"
}
```

**Response (Success):**
```json
{
  "message": "hwid has been successfully linked"
}
```

**Status Codes:**
- `200`: HWID linked successfully
- `404`: User not found
- `409`: HWID already linked
- `401`: Invalid or expired token

**Notes:**
- HWID can only be linked once per user
- Once linked, the HWID cannot be changed through this endpoint

---

## Data Models

### User
```json
{
  "telegram_id": "string (primary key)",
  "username": "string",
  "password": "string (hashed)",
  "hwid": "string (default: 'not_linked')",
  "is_banned": "boolean (default: false)"
}
```

### Token
```json
{
  "access_token": "string",
  "token_type": "string"
}
```

### TokenData
```json
{
  "telegram_id": "string | null",
  "username": "string",
  "is_banned": "boolean",
  "hwid": "string"
}
```

### Hwid
```json
{
  "value": "string"
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "detail": "Error message description"
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data or user is banned |
| 401 | Unauthorized - Invalid or missing authentication token |
| 404 | Not Found - Requested resource doesn't exist |
| 409 | Conflict - Resource already exists or conflicting state |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server-side error |

---

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with automatic salt generation
- Plain text passwords are never stored in the database

### Token Security
- JWT tokens are signed using HS256 algorithm
- Secret key must be provided via environment variable
- Tokens include expiration time to limit exposure

### Hardware ID Protection
- HWID can only be set once per user to prevent abuse
- Used for software license validation and preventing unauthorized access

---

## Environment Configuration

Required environment variables:
- `SECRET_KEY`: JWT signing secret (generate with `openssl rand -hex 32`)

Optional environment variables:
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 30 minutes)
- `ALGORITHM`: JWT signing algorithm (default: "HS256")

---

## Database Schema

The API uses SQLite database with the following table structure:

### Users Table
| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| telegram_id | TEXT | PRIMARY KEY | - |
| username | TEXT | NOT NULL | - |
| password | TEXT | NOT NULL | - |
| hwid | TEXT | - | "not_linked" |
| is_banned | BOOLEAN | - | false |
