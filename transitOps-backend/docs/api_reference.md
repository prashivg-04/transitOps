# TransitOps API Reference

This document serves as the high-level reference for the TransitOps Backend API.

## Core Modules
1. **Authentication:** Login, Registration, JWT Refresh, Current User info.
2. **Vehicles:** CRUD for fleet vehicles, tracking capacity, odometer, and status.
3. **Drivers:** CRUD for driver profiles, license tracking, and safety scores.
4. **Trips:** Dispatch workflows, state transitions (Draft -> Dispatched -> Completed / Cancelled).
5. **Maintenance:** Managing vehicle repairs and automatic status toggles (In Shop).
6. **Fuel Logs & Expenses:** Financial tracking per vehicle and trip.
7. **Dashboard & Reports:** Aggregated KPIs, utilization stats, and operational costs.

For detailed endpoint specifications (Parameters, Payloads, Responses), see `api_endpoints.md`.

## Core Utilities, Error Handling, and Logging

The platform incorporates robust middleware and utilities:
- **Global Error Handling:** Converts all `HTTPException`, `RequestValidationError`, `SQLAlchemyError`, and generic `Exception` into a standard unified JSON format `{success: false, message: string, errors: list}`.
- **Logging (Loguru):** Centralized intercept handler captures all stdout, FastAPI logs, and domain events (like trip dispatched). Recorded with timestamps and levels.
- **Standard Responses:** Reusable `success_response` and `error_response` dictionary builders ensure format consistency.
- **Pagination:** Consistent `{page, page_size, total, total_pages, items}` schema calculation across all list endpoints.
- **Health Check:** Provides DB connection state, uptime, and app version at `/health`.

## Service Layer (Business Logic)
The Service Layer encapsulates all business rules, validates states, and delegates database operations to the CRUD layer. Routers interact exclusively with these services.
- `user_service`: User registration (unique email), profile updates.
- `vehicle_service`: Fleet registration, status transition checks.
- `driver_service`: Driver profiles, license checks, suspension validation.
- `trip_service`: Dispatch workflow (draft -> dispatch -> complete), capacity checks, auto-updating vehicle/driver statuses.
- `maintenance_service`: Auto-toggles vehicle "In Shop" status.
- `fuel_service`: Fuel logging and efficiency calculations.
- `expense_service`: Cost tracking and total operational cost calculation.
- `dashboard_service`: KPI aggregation for real-time fleet overview.
- `report_service`: Vehicle ROI, Utilization %, and efficiency reports.
## CRUD Repository Layer

The CRUD repository layer is responsible purely for database operations and returning SQLAlchemy ORM objects.

### User
- `create_user(db: Session, user_in: UserCreate) -> User`: Creates a new user in the database.
- `get_user_by_id(db: Session, user_id: int) -> Optional[User]`: Retrieves a user by their unique ID.
- `get_user_by_email(db: Session, email: str) -> Optional[User]`: Retrieves a user by their unique email.
- `get_users(db: Session, skip: int = 0, limit: int = 20) -> List[User]`: Retrieves a paginated list of users.
- `update_user(db: Session, db_user: User, user_in: UserUpdate) -> User`: Updates a user's details.
- `delete_user(db: Session, db_user: User) -> None`: Deletes a user from the database.

### Vehicle
- `create_vehicle(db: Session, vehicle_in: VehicleCreate) -> Vehicle`: Creates a new vehicle in the registry.
- `get_vehicle(db: Session, vehicle_id: int) -> Optional[Vehicle]`: Retrieves a vehicle by ID.
- `get_vehicle_by_registration(db: Session, registration_number: str) -> Optional[Vehicle]`: Retrieves a vehicle by registration.
- `get_all_vehicles(db: Session, skip: int = 0, limit: int = 20, search: Optional[str] = None) -> List[Vehicle]`: Retrieves a paginated and searchable list of vehicles.
- `get_available_vehicles(db: Session, skip: int = 0, limit: int = 20) -> List[Vehicle]`: Retrieves vehicles with AVAILABLE status.
- `get_vehicles_by_status(db: Session, status: VehicleStatus, skip: int = 0, limit: int = 20) -> List[Vehicle]`: Retrieves vehicles by specific status.
- `update_vehicle(db: Session, db_vehicle: Vehicle, vehicle_in: VehicleUpdate) -> Vehicle`: Updates vehicle fields.
- `delete_vehicle(db: Session, db_vehicle: Vehicle) -> None`: Deletes a vehicle.

### Driver
- `create_driver(db: Session, driver_in: DriverCreate) -> Driver`: Creates a new driver profile.
- `get_driver(db: Session, driver_id: int) -> Optional[Driver]`: Retrieves a driver by ID.
- `get_driver_by_license(db: Session, license_number: str) -> Optional[Driver]`: Retrieves a driver by license number.
- `get_available_drivers(db: Session, skip: int = 0, limit: int = 20) -> List[Driver]`: Retrieves drivers with AVAILABLE status.
- `get_drivers_by_status(db: Session, status: DriverStatus, skip: int = 0, limit: int = 20) -> List[Driver]`: Retrieves drivers by specific status.
- `update_driver(db: Session, db_driver: Driver, driver_in: DriverUpdate) -> Driver`: Updates driver details.
- `delete_driver(db: Session, db_driver: Driver) -> None`: Deletes a driver.

### Trip
- `create_trip(db: Session, trip_in: TripCreate) -> Trip`: Creates a new trip.
- `get_trip(db: Session, trip_id: int) -> Optional[Trip]`: Alias for get_trip_by_id.
- `get_trip_by_id(db: Session, trip_id: int) -> Optional[Trip]`: Retrieves a trip by ID.
- `get_trips(db: Session, skip: int = 0, limit: int = 20) -> List[Trip]`: Retrieves a paginated list of all trips.
- `get_trips_by_vehicle(db: Session, vehicle_id: int, skip: int = 0, limit: int = 20) -> List[Trip]`: Retrieves trips assigned to a vehicle.
- `get_trips_by_driver(db: Session, driver_id: int, skip: int = 0, limit: int = 20) -> List[Trip]`: Retrieves trips assigned to a driver.
- `get_active_trip(db: Session, vehicle_id: Optional[int] = None, driver_id: Optional[int] = None) -> Optional[Trip]`: Retrieves actively dispatched trip for vehicle/driver.
- `update_trip(db: Session, db_trip: Trip, trip_in: TripUpdate) -> Trip`: Updates trip details.
- `delete_trip(db: Session, db_trip: Trip) -> None`: Deletes a trip.

### Maintenance
- `create_maintenance(db: Session, maintenance_in: MaintenanceCreate) -> Maintenance`: Creates a new maintenance record.
- `get_maintenance(db: Session, maintenance_id: int) -> Optional[Maintenance]`: Retrieves maintenance record by ID.
- `get_active_maintenance(db: Session, vehicle_id: int) -> Optional[Maintenance]`: Retrieves active maintenance record for a vehicle.
- `update_maintenance(db: Session, db_maintenance: Maintenance, maintenance_in: MaintenanceUpdate) -> Maintenance`: Updates a maintenance record.
- `delete_maintenance(db: Session, db_maintenance: Maintenance) -> None`: Deletes a maintenance record.

### Fuel Log
- `create_fuel_log(db: Session, fuel_log_in: FuelLogCreate) -> FuelLog`: Creates a new fuel log.
- `get_fuel_logs_by_vehicle(db: Session, vehicle_id: int, skip: int = 0, limit: int = 20) -> List[FuelLog]`: Retrieves fuel logs for a vehicle.
- `get_fuel_logs_by_trip(db: Session, trip_id: int, skip: int = 0, limit: int = 20) -> List[FuelLog]`: Retrieves fuel logs for a trip.
- `update_fuel_log(db: Session, db_fuel_log: FuelLog, fuel_log_in: FuelLogUpdate) -> FuelLog`: Updates a fuel log.
- `delete_fuel_log(db: Session, db_fuel_log: FuelLog) -> None`: Deletes a fuel log.

### Expense
- `create_expense(db: Session, expense_in: ExpenseCreate) -> Expense`: Creates a new expense record.
- `get_vehicle_expenses(db: Session, vehicle_id: int, skip: int = 0, limit: int = 20) -> List[Expense]`: Retrieves expenses associated with a vehicle.
- `get_expense(db: Session, expense_id: int) -> Optional[Expense]`: Retrieves an expense record by ID.
- `update_expense(db: Session, db_expense: Expense, expense_in: ExpenseUpdate) -> Expense`: Updates an expense record.
- `delete_expense(db: Session, db_expense: Expense) -> None`: Deletes an expense record.
