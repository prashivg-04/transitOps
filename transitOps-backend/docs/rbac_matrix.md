# TransitOps Role-Based Access Control (RBAC) Matrix

This document outlines the strict permission matrix enforced across the TransitOps backend application.

## 1. Access Definitions

- **VIEW**: Represents read-only access. The user is authorized to interact with `GET` endpoints within the domain (e.g., list all items, get an item by ID) but cannot modify data.
- **FULL**: Represents total administrative access to the domain. The user is authorized to interact with `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and any custom action endpoints (e.g., dispatch, complete, close).
- **NO ACCESS**: The user is completely restricted from the domain. Any attempt to interact with an endpoint inside this domain will return a `403 Forbidden` standard response.

## 2. Global Permission Matrix

| Domain / Resource       | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|-------------------------|---------------|------------|----------------|-------------------|
| **Dashboard**           | FULL (VIEW)   | VIEW       | VIEW           | VIEW              |
| **Fleet (Vehicles)**    | FULL          | VIEW       | NO ACCESS      | VIEW              |
| **Drivers**             | VIEW          | VIEW       | FULL           | NO ACCESS         |
| **Trips**               | VIEW          | FULL       | VIEW           | VIEW              |
| **Maintenance**         | FULL          | NO ACCESS  | NO ACCESS      | VIEW              |
| **Fuel Logs**           | VIEW          | NO ACCESS  | NO ACCESS      | FULL              |
| **Expenses**            | VIEW          | NO ACCESS  | NO ACCESS      | FULL              |
| **Analytics / Reports** | FULL (VIEW)   | NO ACCESS  | NO ACCESS      | FULL (VIEW)       |
| **Settings / Users**    | FULL          | VIEW       | VIEW           | VIEW              |

*(Note: Domains with only `GET` endpoints are marked functionally as `FULL (VIEW)` or `VIEW`, as they inherently lack write capabilities.)*

## 3. Enforcement and Errors

All endpoints use the global `RoleChecker` dependency injection. The previous "implicit" global access bypass for Fleet Managers has been explicitly removed, ensuring Fleet Managers are restricted strictly to the permissions listed in this matrix.

### Example: Forbidden Operation
If a **Dispatcher** attempts to create a new vehicle (`POST /api/v1/vehicles`), the system intercepts the request before it reaches the router logic and returns the following `HTTP 403 Forbidden` response utilizing the standard exception format:

```json
{
  "detail": "Operation not permitted for your role"
}
```
*(FastAPI's built-in `HTTPException` returns this standard dictionary by default. Global error handlers standardize it further if configured).*
