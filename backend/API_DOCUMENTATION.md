# SkillForge API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <jwt-token>
```

## Response Format
```json
{
  "success": true/false,
  "message": "error message (if any)",
  "data": { ... }
}
```

## Endpoints

### 🔓 Public Endpoints

#### Authentication
```http
POST /api/auth/login
POST /api/auth/register
GET  /api/health
```

**Login:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "STUDENT"
    }
  }
}
```

### 🔒 Protected Endpoints

#### Dashboard
```http
GET /api/dashboard
```
Returns user + stats in one call.

#### Users
```http
GET /api/users/me    # Current user
GET /api/users       # All users
```

#### Courses
```http
GET    /api/courses      # List all
POST   /api/courses      # Create new
GET    /api/courses/{id} # Get by ID
DELETE /api/courses/{id} # Delete
```

## Error Handling
```json
{
  "success": false,
  "message": "Email is required, Password must be at least 6 characters"
}
```

## Quick Start
1. **Register:** `POST /api/auth/register`
2. **Login:** `POST /api/auth/login` → Get token
3. **Dashboard:** `GET /api/dashboard` → Get user + stats
4. **Use token** in Authorization header for protected endpoints