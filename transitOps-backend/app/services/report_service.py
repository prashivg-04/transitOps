from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.vehicle import Vehicle, VehicleStatus
from app.models.trip import Trip, TripStatus
from app.services.fuel_service import calculate_fuel_efficiency
from app.services.expense_service import calculate_operational_cost

def generate_fleet_utilization_report(db: Session) -> dict:
    """Generate fleet utilization percentages."""
    total = db.query(func.count(Vehicle.id)).scalar() or 0
    retired = db.query(func.count(Vehicle.id)).filter(Vehicle.status == VehicleStatus.RETIRED).scalar() or 0
    active = db.query(func.count(Vehicle.id)).filter(Vehicle.status == VehicleStatus.ON_TRIP).scalar() or 0
    
    usable = total - retired
    utilization = round((active / usable * 100), 2) if usable > 0 else 0.0
    
    return {
        "total_vehicles": total,
        "usable_vehicles": usable,
        "active_vehicles": active,
        "utilization_percent": utilization
    }

def generate_vehicle_roi_report(db: Session, vehicle_id: int) -> dict:
    """Calculate ROI for a specific vehicle."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        return {}
        
    revenue = db.query(func.sum(Trip.revenue)).filter(Trip.vehicle_id == vehicle_id).scalar() or 0.0
    operational_cost = calculate_operational_cost(db, vehicle_id)
    
    total_cost = vehicle.acquisition_cost + operational_cost
    net_profit = revenue - total_cost
    
    roi_percent = round((net_profit / total_cost * 100), 2) if total_cost > 0 else 0.0
    
    return {
        "vehicle_id": vehicle.id,
        "registration_number": vehicle.registration_number,
        "acquisition_cost": vehicle.acquisition_cost,
        "operational_cost": operational_cost,
        "total_cost": total_cost,
        "total_revenue": revenue,
        "net_profit": net_profit,
        "roi_percent": roi_percent
    }

def generate_fuel_efficiency_report(db: Session) -> list:
    """Generate fuel efficiency report for all usable vehicles."""
    vehicles = db.query(Vehicle).filter(Vehicle.status != VehicleStatus.RETIRED).all()
    report = []
    for v in vehicles:
        report.append({
            "vehicle_id": v.id,
            "registration_number": v.registration_number,
            "fuel_efficiency_km_per_l": calculate_fuel_efficiency(db, v.id)
        })
    return report

def generate_trip_summary(db: Session) -> dict:
    """Summary of trips by status."""
    draft = db.query(func.count(Trip.id)).filter(Trip.status == TripStatus.DRAFT).scalar() or 0
    dispatched = db.query(func.count(Trip.id)).filter(Trip.status == TripStatus.DISPATCHED).scalar() or 0
    completed = db.query(func.count(Trip.id)).filter(Trip.status == TripStatus.COMPLETED).scalar() or 0
    cancelled = db.query(func.count(Trip.id)).filter(Trip.status == TripStatus.CANCELLED).scalar() or 0
    
    return {
        "draft": draft,
        "dispatched": dispatched,
        "completed": completed,
        "cancelled": cancelled,
        "total": draft + dispatched + completed + cancelled
    }
