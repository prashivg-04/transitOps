# API Endpoints Documentation

*All endpoints are prefixed with `/api/v1`*

> **Note:** All successful responses follow a standard Pydantic generic wrapper:
> - **Single resource:** `SuccessResponse[T]`
>   `{"success": true, "message": "...", "data": {...}}`
> - **List (paginated):** `PaginatedResponse[T]`
>   `{"success": true, "message": "...", "data": [...], "page": 1, "page_size": 20, "total": N, "total_pages": N}`
> - All list endpoints accept `?skip=0&limit=20` query parameters.

---

## 1. Authentication (`/auth`)

### 1.1 Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Authentication:** No
- **Roles:** None
- **Headers:** `Content-Type: application/x-www-form-urlencoded`
- **Path Parameters:** None
- **Query Parameters:** None
- **Request JSON:** Form data (username, password)
- **Response JSON:** `Token` schema (`access_token`, `refresh_token`, `token_type`, `user`)
- **HTTP Status Codes:** `200 OK`, `401 Unauthorized`
- **Validation Rules:** Valid email and password
- **Example Request:** `username=admin@transitops.com&password=Password123`
- **Example Response:** `{"access_token": "...", "token_type": "bearer", ...}`

### 1.2 Register
- **URL:** `/auth/register`
- **Method:** `POST`
- **Authentication:** No
- **Roles:** None
- **Headers:** `Content-Type: application/json`
- **Request JSON:** `UserCreate` schema
- **Response JSON:** `UserRead` schema
- **HTTP Status Codes:** `201 Created`, `400 Bad Request`
- **Validation Rules:** Email must be unique.

### 1.3 Refresh Token
- **URL:** `/auth/refresh`
- **Method:** `POST`
- **Authentication:** No
- **Roles:** None
- **Request JSON:** `{"refresh_token": "..."}`
- **Response JSON:** `Token` schema
- **HTTP Status Codes:** `200 OK`, `401 Unauthorized`
- **Validation Rules:** Refresh token must be valid and not expired.

### 1.4 Get Current User
- **URL:** `/auth/me`
- **Method:** `GET`
- **Authentication:** Yes
- **Roles:** Any
- **Headers:** `Authorization: Bearer <token>`
- **Response JSON:** `UserRead` schema
- **HTTP Status Codes:** `200 OK`, `401 Unauthorized`

---

## 2. Users (`/users`)

### 2.1 List Users
- **URL:** `/users`
- **Method:** `GET`
- **Authentication:** Yes
- **Roles:** Fleet Manager
- **Query Parameters:** `skip` (int, default 0), `limit` (int, default 20)
- **Response JSON:** Paginated `UserRead` list
- **HTTP Status Codes:** `200 OK`, `403 Forbidden`

### 2.2 Create User
- **URL:** /users
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Fleet Manager
- **Request JSON:** `UserCreate`
- **Response JSON:** `UserRead`
- **HTTP Status Codes:** `201 Created`

*(Similar endpoints exist for `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}`)*

---

## 3. Vehicles (`/vehicles`)

### 3.1 List Vehicles
- **URL:** `/vehicles`
- **Method:** `GET`
- **Authentication:** Yes
- **Roles:** Fleet Manager, Dispatcher, Safety Officer
- **Query Parameters:** `skip` (int, default 0), `limit` (int, default 20), `search` (optional string)
- **Response JSON:** Paginated `VehicleRead` list with `page`, `total`, `total_pages`
- **HTTP Status Codes:** `200 OK`

### 3.2 List Available Vehicles
- **URL:** /vehicles/available
- **Method:** GET
- **Authentication:** Yes
- **Roles:** Fleet Manager, Dispatcher, Financial Analyst
- **Response JSON:** Paginated `VehicleRead` list (Status = AVAILABLE)
- **HTTP Status Codes:** `200 OK`

### 3.3 Create Vehicle
- **URL:** /vehicles
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Fleet Manager
- **Request JSON:** `VehicleCreate`
- **Response JSON:** `VehicleRead`
- **HTTP Status Codes:** `201 Created`, `400 Bad Request`
- **Validation Rules:** Unique registration number

*(Similar endpoints exist for `GET /vehicles/{id}`, `PUT /vehicles/{id}`, `DELETE /vehicles/{id}`, `GET /vehicles/status/{status}`)*

---

## 4. Dispatchers (`/drivers`)

*(Similar CRUD structure as Vehicles, mapped to `/drivers` and `/drivers/available`)*

---

## 5. Trips (`/trips`)

### 5.1 Create Trip (Draft)
- **URL:** /trips
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Dispatcher
- **Request JSON:** `TripCreate`
- **Response JSON:** `TripRead`
- **HTTP Status Codes:** `201 Created`, `400 Bad Request`
- **Validation Rules:** Cargo weight <= Vehicle max_load_capacity

### 5.2 Dispatch Trip
- **URL:** /trips/{id}/dispatch
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Dispatcher
- **Request JSON:** `TripDispatch` (Optional start odometer)
- **Response JSON:** `TripRead`
- **HTTP Status Codes:** `200 OK`, `400 Bad Request`
- **Validation Rules:** Trip must be Draft. Vehicle/Dispatcher must be Available. Dispatcher license valid.

### 5.3 Complete Trip
- **URL:** /trips/{id}/complete
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Dispatcher
- **Request JSON:** `TripComplete` (End odometer, fuel, actual distance)
- **Response JSON:** `TripRead`
- **HTTP Status Codes:** `200 OK`, `400 Bad Request`
- **Validation Rules:** Trip must be Dispatched.

### 5.4 Cancel Trip
- **URL:** /trips/{id}/cancel
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Dispatcher
- **Response JSON:** `TripRead`
- **HTTP Status Codes:** `200 OK`, `400 Bad Request`

*(Standard CRUD also exists for `GET /trips`, `GET /trips/{id}`, `PUT /trips/{id}`, `DELETE /trips/{id}`)*

---

## 6. Maintenance (`/maintenance`)

### 6.1 Create Maintenance
- **URL:** /maintenance
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Fleet Manager
- **Request JSON:** `MaintenanceCreate`
- **Response JSON:** `MaintenanceRead`
- **HTTP Status Codes:** `201 Created`, `400 Bad Request`
- **Validation Rules:** Sets Vehicle status to IN_SHOP. Cannot create if vehicle is ON_TRIP.

### 6.2 Close Maintenance
- **URL:** /maintenance/{id}/close
- **Method:** POST
- **Authentication:** Yes
- **Roles:** Fleet Manager
- **Response JSON:** `MaintenanceRead`
- **HTTP Status Codes:** `200 OK`
- **Validation Rules:** Restores Vehicle status to AVAILABLE.

---

## 7. Fuel Logs (`/fuel`) & Expenses (`/expenses`)

*(Standard CRUD mapped to `/fuel` and `/expenses`. Roles: Financial Analyst, Fleet Manager)*

---

## 8. Dashboard & Reports

### 8.1 Dashboard Stats
- **URL:** /dashboard
- **Method:** GET
- **Authentication:** Yes
- **Roles:** Fleet Manager, Dispatcher, Safety Officer, Financial Analyst
- **Response JSON:**
  ```json
  {
    "active_vehicles": 5,
    "available_vehicles": 10,
    "vehicles_in_shop": 2,
    "retired_vehicles": 1,
    "drivers_on_duty": 5,
    "drivers_available": 15,
    "active_trips": 5,
    "pending_trips": 2,
    "fleet_utilization_percent": 33.3,
    "operational_cost": 54000.50
  }
  ```

*(Reports endpoints exist at `/reports/fuel-efficiency`, `/reports/fleet-utilization`, `/reports/vehicle-roi`, `/reports/trip-summary`)*
