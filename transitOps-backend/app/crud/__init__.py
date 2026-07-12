"""
app.crud
~~~~~~~~
CRUD repository layer for all database entities.
"""

from app.crud.user import (
    create_user, get_user_by_id, get_user_by_email, get_users, update_user, delete_user
)
from app.crud.vehicle import (
    create_vehicle, get_vehicle, get_vehicle_by_registration, get_all_vehicles, get_available_vehicles, get_vehicles_by_status, update_vehicle, delete_vehicle
)
from app.crud.driver import (
    create_driver, get_driver, get_driver_by_license, get_available_drivers, get_drivers_by_status, update_driver, delete_driver
)
from app.crud.trip import (
    create_trip, get_trip, get_trip_by_id, get_trips, get_trips_by_vehicle, get_trips_by_driver, get_active_trip, update_trip, delete_trip
)
from app.crud.maintenance import (
    create_maintenance, get_maintenance, get_active_maintenance, update_maintenance, delete_maintenance
)
from app.crud.fuel_log import (
    create_fuel_log, get_fuel_logs_by_vehicle, get_fuel_logs_by_trip, update_fuel_log, delete_fuel_log
)
from app.crud.expense import (
    create_expense, get_expense, get_vehicle_expenses, update_expense, delete_expense
)
