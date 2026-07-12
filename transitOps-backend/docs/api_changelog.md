# API Changelog

## [Core System & Utilities Added]
### Error Handling & Middlewares
- `exceptions.py`: Centralized domain exceptions (`TransitOpsException`, `ValidationException`, `ConflictException`, etc.).
- `error_handlers.py`: Global translation of unhandled exceptions, validation errors, and DB errors to a unified JSON response.
- `error_middleware.py`: Catch-all fail-safe middleware.
- `request_logger.py`: Logs HTTP method, path, status, and duration for all incoming traffic.

### Logging & Utilities
- `logging.py`: Loguru integration replacing standard library logging for unified formatted output.
- `response.py`: Standard `success_response` and `error_response` generators.
- `pagination.py`: Reusable metadata calculation (`page`, `total_pages`).
- `constants.py`: Application-wide enums and string constants.

## [Service Layer Added]
### Services Added
- `user_service.py`
- `vehicle_service.py`
- `driver_service.py`
- `trip_service.py`
- `maintenance_service.py`
- `fuel_service.py`
- `expense_service.py`
- `dashboard_service.py`
- `report_service.py`

### Business Rules Implemented
- Vehicle unique registration and status transition safeguards.
- Driver unique license, expiry validation, and status safeguards.
- Trip cargo capacity validation, strict asset availability requirements.
- Trip dispatching and completion automatic status state machines for Vehicles & Drivers.
- Maintenance workflow auto-toggling "In Shop".
- Fuel efficiency and ROI reporting.

## [Initial CRUD Layer Added]
### User CRUD
- `create_user()`
- `get_user_by_id()`
- `get_user_by_email()`
- `get_users()`
- `update_user()`
- `delete_user()`

### Vehicle CRUD
- `create_vehicle()`
- `get_vehicle()`
- `get_vehicle_by_registration()`
- `get_all_vehicles()`
- `get_available_vehicles()`
- `get_vehicles_by_status()`
- `update_vehicle()`
- `delete_vehicle()`

### Driver CRUD
- `create_driver()`
- `get_driver()`
- `get_driver_by_license()`
- `get_available_drivers()`
- `get_drivers_by_status()`
- `update_driver()`
- `delete_driver()`

### Trip CRUD
- `create_trip()`
- `get_trip()`
- `get_trip_by_id()`
- `get_trips()`
- `get_trips_by_vehicle()`
- `get_trips_by_driver()`
- `get_active_trip()`
- `update_trip()`
- `delete_trip()`

### Maintenance CRUD
- `create_maintenance()`
- `get_maintenance()`
- `get_active_maintenance()`
- `update_maintenance()`
- `delete_maintenance()`

### Fuel Log CRUD
- `create_fuel_log()`
- `get_fuel_logs_by_vehicle()`
- `get_fuel_logs_by_trip()`
- `update_fuel_log()`
- `delete_fuel_log()`

### Expense CRUD
- `create_expense()`
- `get_vehicle_expenses()`
- `get_expense()`
- `update_expense()`
- `delete_expense()`
