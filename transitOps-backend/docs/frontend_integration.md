# Frontend Integration Guide

## Base Information
- **Base URL (Local):** `http://localhost:8000`
- **API Prefix:** `/api/v1` (All routers are mounted under this prefix in `main.py`)

## Authentication
- **Mechanism:** JWT (JSON Web Tokens)
- **Header Format:** `Authorization: Bearer <access_token>`
- **Token Refresh:** Use the `/api/v1/auth/refresh` endpoint when the token expires.

## Request Format
- **Content-Type:** `application/json` (except `/api/v1/auth/login` which uses `application/x-www-form-urlencoded`)
- **Accept:** `application/json`

## Expected Payloads
### Request Payloads
For POST and PUT requests, send JSON that matches the corresponding `Create` or `Update` Pydantic schemas defined in the backend.

### Response Payloads
Responses are now standardized globally using the unified API response wrapper.
Example Success Response:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "registration_number": "KBC-123A",
    "vehicle_type": "Truck",
    "status": "Available",
    "created_at": "2026-07-12T10:00:00Z"
  }
}
```

### Pagination Format
Pagination endpoints return standard metadata.
```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "page": 1,
  "page_size": 20,
  "total": 50,
  "total_pages": 3
}
```

### Error Payload Format
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {"loc": ["body", "cargo_weight"], "msg": "Input should be greater than 0", "type": "greater_than"}
  ]
}
```

## Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `204 No Content`: Resource successfully deleted.
- `400 Bad Request`: Validation or business rule error (e.g., cargo exceeds capacity).
- `401 Unauthorized`: Missing or invalid JWT, or bad login credentials.
- `403 Forbidden`: Authenticated, but insufficient role permissions (RBAC).
- `404 Not Found`: Resource does not exist.
- `422 Unprocessable Entity`: Data schema validation error.

## Pagination Query Parameters
All list endpoints (`GET /vehicles`, `GET /drivers`, `GET /trips`, `GET /maintenance`, `GET /fuel`, `GET /expenses`, `GET /users`) accept:

| Parameter | Type    | Default | Description                    |
|-----------|---------|---------|--------------------------------|
| `skip`    | integer | `0`     | Number of records to skip      |
| `limit`   | integer | `20`    | Max number of records to return|

The paginated response includes these metadata fields:
```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "page": 1,
  "page_size": 20,
  "total": 100,
  "total_pages": 5
}
```

### Navigating Pages
- Page 1: `?skip=0&limit=20`
- Page 2: `?skip=20&limit=20`
- Page 3: `?skip=40&limit=20`
