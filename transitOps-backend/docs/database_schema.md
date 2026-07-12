# Database Schema

## Users
- `id` (PK)
- `full_name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: Fleet Manager, Driver, Safety Officer, Financial Analyst, Admin)

## Vehicles
- `id` (PK)
- `registration_number` (String, Unique)
- `vehicle_name` (String)
- `vehicle_type` (Enum: Truck, Van, Car, Motorcycle, Bus, Pickup, Trailer)
- `max_load_capacity` (Float)
- `odometer` (Float)
- `acquisition_cost` (Float)
- `status` (Enum: Available, On Trip, In Shop, Retired)
- `region` (String, Optional)

## Drivers
- `id` (PK)
- `name` (String)
- `license_number` (String, Unique)
- `license_category` (Enum: A, B, C, D, E, F)
- `license_expiry` (Date)
- `contact_number` (String)
- `safety_score` (Float)
- `status` (Enum: Available, On Trip, Off Duty, Suspended)

## Trips
- `id` (PK)
- `source` (String)
- `destination` (String)
- `vehicle_id` (FK -> Vehicles.id)
- `driver_id` (FK -> Drivers.id)
- `cargo_weight` (Float)
- `planned_distance` (Float)
- `actual_distance` (Float, nullable)
- `revenue` (Float, nullable)
- `fuel_consumed` (Float, nullable)
- `start_odometer` (Float, nullable)
- `end_odometer` (Float, nullable)
- `status` (Enum: Draft, Dispatched, Completed, Cancelled)
- `notes` (Text, nullable)

## Maintenance Logs
- `id` (PK)
- `vehicle_id` (FK -> Vehicles.id)
- `title` (String)
- `description` (Text, nullable)
- `cost` (Float)
- `start_date` (Date)
- `end_date` (Date, nullable)
- `active` (Boolean)

## Fuel Logs
- `id` (PK)
- `vehicle_id` (FK -> Vehicles.id)
- `trip_id` (FK -> Trips.id, nullable)
- `liters` (Float)
- `cost` (Float)
- `date` (Date)
- `station` (String, nullable)
- `notes` (String, nullable)

## Expenses
- `id` (PK)
- `vehicle_id` (FK -> Vehicles.id)
- `category` (Enum: Toll, Maintenance, Repair, Insurance, Registration, Parking, Miscellaneous)
- `amount` (Float)
- `remarks` (String, nullable)
- `date` (Date)
