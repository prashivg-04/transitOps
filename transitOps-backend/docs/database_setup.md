# PostgreSQL Database Setup

This document details the database schema, enumeration types, and setup required for the TransitOps backend to run correctly on PostgreSQL.

## 1. Required PostgreSQL Enums

FastAPI and SQLAlchemy use `values_callable` in the `SAEnum` definitions to ensure that PostgreSQL stores the exact string representation (the human-readable `Enum.value`) rather than the Python variable name.

If you are initializing a fresh database, `Base.metadata.create_all(bind=engine)` will create these automatically.

The 7 enums used across the application are:

1. **`user_role_enum`**
   - Values: `'Fleet Manager'`, `'Dispatcher'`, `'Safety Officer'`, `'Financial Analyst'`
2. **`vehicle_type_enum`**
   - Values: `'Truck'`, `'Van'`, `'Car'`, `'Motorcycle'`, `'Bus'`, `'Pickup'`, `'Trailer'`
3. **`vehicle_status_enum`**
   - Values: `'Available'`, `'On Trip'`, `'In Shop'`, `'Retired'`
4. **`driver_status_enum`**
   - Values: `'Available'`, `'On Trip'`, `'Off Duty'`, `'Suspended'`
5. **`license_category_enum`**
   - Values: `'A'`, `'B'`, `'C'`, `'D'`, `'E'`, `'F'`
6. **`trip_status_enum`**
   - Values: `'Draft'`, `'Dispatched'`, `'Completed'`, `'Cancelled'`
7. **`expense_category_enum`**
   - Values: `'Toll'`, `'Maintenance'`, `'Repair'`, `'Insurance'`, `'Registration'`, `'Parking'`, `'Miscellaneous'`

## 2. Table Creation Order

SQLAlchemy handles the topological sort automatically, creating tables without foreign keys first, followed by dependent tables. The actual creation order executed by `create_all` is:

1. `users` (Standalone)
2. `vehicles` (Standalone)
3. `drivers` (Standalone)
4. `trips` (Depends on `vehicles`, `drivers`)
5. `maintenance_logs` (Depends on `vehicles`)
6. `expenses` (Depends on `vehicles`)
7. `fuel_logs` (Depends on `vehicles`, `trips` optionally)

## 3. Fixing Existing Enums (Manual SQL)

If you have an existing PostgreSQL database where the enums were created *without* `values_callable`, the database holds uppercase Python member names (e.g., `DRIVER`, `ON_TRIP`). Because SQLAlchemy sets `server_default='Driver'`, PostgreSQL will throw an `InvalidTextRepresentation` error.

To resolve this, you must recreate the enums. Connect to your PostgreSQL console (psql or Supabase SQL editor) and execute:

```sql
-- Drop dependent tables first if they exist
DROP TABLE IF EXISTS trips, maintenance_logs, expenses, fuel_logs, users, vehicles, drivers CASCADE;

-- Drop incorrectly defined enums
DROP TYPE IF EXISTS user_role_enum CASCADE;
DROP TYPE IF EXISTS vehicle_type_enum CASCADE;
DROP TYPE IF EXISTS vehicle_status_enum CASCADE;
DROP TYPE IF EXISTS driver_status_enum CASCADE;
DROP TYPE IF EXISTS license_category_enum CASCADE;
DROP TYPE IF EXISTS trip_status_enum CASCADE;
DROP TYPE IF EXISTS expense_category_enum CASCADE;
```

After executing the above script, run the FastAPI application. The `lifespan` handler will invoke `Base.metadata.create_all()`, which will recreate the enums with the correct `values_callable` string representations and build the tables successfully.
