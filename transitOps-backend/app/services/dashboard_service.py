from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.vehicle import Vehicle, VehicleStatus
from app.models.driver import Driver, DriverStatus
from app.models.trip import Trip, TripStatus
from app.models.fuel_log import FuelLog
from app.models.maintenance import Maintenance
from app.models.expense import Expense

def get_dashboard_stats(db: Session) -> dict:
    """
    Returns aggregated dashboard statistics.
    """
    # Vehicles
    total_vehicles = db.query(func.count(Vehicle.id)).scalar() or 0
    active_vehicles = db.query(func.count(Vehicle.id)).filter(Vehicle.status == VehicleStatus.ON_TRIP).scalar() or 0
    available_vehicles = db.query(func.count(Vehicle.id)).filter(Vehicle.status == VehicleStatus.AVAILABLE).scalar() or 0
    in_shop_vehicles = db.query(func.count(Vehicle.id)).filter(Vehicle.status == VehicleStatus.IN_SHOP).scalar() or 0
    retired_vehicles = db.query(func.count(Vehicle.id)).filter(Vehicle.status == VehicleStatus.RETIRED).scalar() or 0
    
    # Drivers
    total_drivers = db.query(func.count(Driver.id)).scalar() or 0
    drivers_on_duty = db.query(func.count(Driver.id)).filter(Driver.status == DriverStatus.ON_TRIP).scalar() or 0
    drivers_available = db.query(func.count(Driver.id)).filter(Driver.status == DriverStatus.AVAILABLE).scalar() or 0
    
    # Trips
    active_trips = db.query(func.count(Trip.id)).filter(Trip.status == TripStatus.DISPATCHED).scalar() or 0
    pending_trips = db.query(func.count(Trip.id)).filter(Trip.status == TripStatus.DRAFT).scalar() or 0
    
    # Costs
    total_fuel_cost = db.query(func.sum(FuelLog.cost)).scalar() or 0.0
    total_maintenance_cost = db.query(func.sum(Maintenance.cost)).scalar() or 0.0
    total_expenses = db.query(func.sum(Expense.amount)).scalar() or 0.0
    
    operational_cost = total_fuel_cost + total_maintenance_cost + total_expenses
    
    # Fleet Utilization % = (Active Vehicles / (Total - Retired)) * 100
    utilization = 0.0
    usable_vehicles = total_vehicles - retired_vehicles
    if usable_vehicles > 0:
        utilization = round((active_vehicles / usable_vehicles) * 100, 2)
        
    return {
        "active_vehicles": active_vehicles,
        "available_vehicles": available_vehicles,
        "vehicles_in_shop": in_shop_vehicles,
        "retired_vehicles": retired_vehicles,
        "drivers_on_duty": drivers_on_duty,
        "drivers_available": drivers_available,
        "active_trips": active_trips,
        "pending_trips": pending_trips,
        "fleet_utilization_percent": utilization,
        "total_fuel_cost": round(total_fuel_cost, 2),
        "total_maintenance_cost": round(total_maintenance_cost, 2),
        "total_expenses": round(total_expenses, 2),
        "operational_cost": round(operational_cost, 2)
    }
