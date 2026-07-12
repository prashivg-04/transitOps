from enum import Enum

class RoleConstants(str, Enum):
    FLEET_MANAGER = "Fleet Manager"
    DRIVER = "Driver"
    SAFETY_OFFICER = "Safety Officer"
    FINANCIAL_ANALYST = "Financial Analyst"
    ADMIN = "Admin"

class VehicleStatusConstants(str, Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"

class DriverStatusConstants(str, Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"

class TripStatusConstants(str, Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class MaintenanceStatusConstants(str, Enum):
    ACTIVE = "Active"
    CLOSED = "Closed"

class HttpMessages(str, Enum):
    NOT_FOUND = "Resource not found"
    UNAUTHORIZED = "Unauthorized access"
    FORBIDDEN = "Forbidden operation"
    CONFLICT = "Resource conflict detected"
    SERVER_ERROR = "Internal server error"
    SUCCESS = "Operation completed successfully"
