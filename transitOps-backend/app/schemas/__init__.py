"""
app.schemas
~~~~~~~~~~~
Centralised re-export of every Pydantic schema so routers can do:

    from app.schemas import VehicleCreate, TripRead, ...
"""

# ── User ──────────────────────────────────────────────────────────────────────
from app.schemas.user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserRead,
    UserResponse,
    UserLogin,
    Token,
    RefreshTokenRequest,
    TokenData,
)

# ── Vehicle ───────────────────────────────────────────────────────────────────
from app.schemas.vehicle import (
    VehicleBase,
    VehicleCreate,
    VehicleUpdate,
    VehicleRead,
    VehicleResponse,
    VehicleListResponse,
)

# ── Driver ────────────────────────────────────────────────────────────────────
from app.schemas.driver import (
    DriverBase,
    DriverCreate,
    DriverUpdate,
    DriverRead,
    DriverResponse,
    DriverListResponse,
)

# ── Trip ──────────────────────────────────────────────────────────────────────
from app.schemas.trip import (
    TripBase,
    TripCreate,
    TripUpdate,
    TripRead,
    TripDispatch,
    TripComplete,
    TripResponse,
    TripListResponse,
    VehicleSlim,
    DriverSlim,
)

# ── Maintenance ───────────────────────────────────────────────────────────────
from app.schemas.maintenance import (
    MaintenanceBase,
    MaintenanceCreate,
    MaintenanceUpdate,
    MaintenanceRead,
    MaintenanceResponse,
    MaintenanceListResponse,
)

# ── FuelLog ───────────────────────────────────────────────────────────────────
from app.schemas.fuel_log import (
    FuelLogBase,
    FuelLogCreate,
    FuelLogUpdate,
    FuelLogRead,
    FuelLogResponse,
    FuelLogListResponse,
)

# ── Expense ───────────────────────────────────────────────────────────────────
from app.schemas.expense import (
    ExpenseBase,
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseRead,
    ExpenseResponse,
    ExpenseListResponse,
)

__all__ = [
    # user
    "UserBase", "UserCreate", "UserUpdate", "UserRead", "UserResponse",
    "UserLogin", "Token", "RefreshTokenRequest", "TokenData",
    # vehicle
    "VehicleBase", "VehicleCreate", "VehicleUpdate", "VehicleRead",
    "VehicleResponse", "VehicleListResponse",
    # driver
    "DriverBase", "DriverCreate", "DriverUpdate", "DriverRead",
    "DriverResponse", "DriverListResponse",
    # trip
    "TripBase", "TripCreate", "TripUpdate", "TripRead",
    "TripDispatch", "TripComplete", "TripResponse", "TripListResponse",
    "VehicleSlim", "DriverSlim",
    # maintenance
    "MaintenanceBase", "MaintenanceCreate", "MaintenanceUpdate", "MaintenanceRead",
    "MaintenanceResponse", "MaintenanceListResponse",
    # fuel_log
    "FuelLogBase", "FuelLogCreate", "FuelLogUpdate", "FuelLogRead",
    "FuelLogResponse", "FuelLogListResponse",
    # expense
    "ExpenseBase", "ExpenseCreate", "ExpenseUpdate", "ExpenseRead",
    "ExpenseResponse", "ExpenseListResponse",
]
