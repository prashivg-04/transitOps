# TransitOps Business Rules

## 1. Vehicle Management
- **Unique Registration:** The vehicle registration number must be unique.
- **Availability Restrictions:** Retired or In Shop vehicles must never appear in the dispatch selection.

## 2. Driver Management
- **License Validity:** Drivers with expired licenses cannot be assigned to trips.
- **Suspended Drivers:** Suspended drivers cannot be assigned to trips.

## 3. Trip Dispatching & Lifecycle
- **Exclusive Assignment:** A driver or vehicle already marked "On Trip" cannot be assigned to another trip.
- **Capacity Constraint:** Cargo Weight must not exceed the vehicle's maximum load capacity.
- **Dispatching:** Dispatching a trip automatically changes both the vehicle and driver status to "On Trip".
- **Completion:** Completing a trip automatically changes both the vehicle and driver status back to "Available".
- **Cancellation:** Cancelling a dispatched trip restores the vehicle and driver to "Available".

## 4. Maintenance Workflow
- **In-Shop Status:** Creating an active maintenance record automatically changes vehicle status to "In Shop".
- **Closing Maintenance:** Closing maintenance restores the vehicle to "Available" (unless the vehicle is retired).

## 5. Service Workflows & Exceptions Raised

### `vehicle_service.py`
- **Rules Implemented:** Unique registration check, prevents retiring vehicles currently "On Trip", prevents deleting vehicles "On Trip".
- **Exceptions:** `400 Bad Request` if registration exists, or if invalid state transition (retire/delete while on trip).

### `driver_service.py`
- **Rules Implemented:** Unique license check, prevents suspending/deleting drivers currently "On Trip".
- **Exceptions:** `400 Bad Request` for duplicate license or invalid state transition.

### `trip_service.py`
- **Rules Implemented:** Cargo weight capacity check, availability checks (Vehicle and Driver), Driver license expiry check, automatic state transitions on Dispatch/Complete/Cancel.
- **Exceptions:** `400 Bad Request` for cargo overload, unavailable assets, expired license, or invalid trip state transitions (e.g., dispatching an already dispatched trip).

### `maintenance_service.py`
- **Rules Implemented:** Automatic Vehicle state transition to "In Shop" on active maintenance. Restores to "Available" when closed (unless retired). Prevents maintenance on vehicles "On Trip".
- **Exceptions:** `400 Bad Request` for conflicting states (active maintenance exists, or vehicle on trip).

### `fuel_service.py` & `expense_service.py`
- **Rules Implemented:** Record fuel and expenses, calculate operational costs, calculate fuel efficiency.
- **Exceptions:** standard `404 Not Found` if resources missing.

### `dashboard_service.py` & `report_service.py`
- **Rules Implemented:** KPI aggregation (Active vehicles, utilization, ROI, cost summaries).

## 6. Role-Based Access Control (RBAC) Matrix

The system enforces strict access control utilizing four defined roles: `Fleet Manager`, `Dispatcher`, `Safety Officer`, and `Financial Analyst`.

The detailed, strict permission rules determining VIEW, FULL, and NO ACCESS for each module are fully documented in a dedicated file:
[rbac_matrix.md](./rbac_matrix.md)
