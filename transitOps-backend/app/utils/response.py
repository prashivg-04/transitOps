from typing import Any, Optional, Dict, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class SuccessResponse(BaseModel, Generic[T]):
    """Generic wrapper for success API responses."""
    success: bool = True
    message: str = "Success"
    data: T

def success_response(data: Any = None, message: str = "Success") -> Dict[str, Any]:
    """Standard success API response format."""
    response = {
        "success": True,
        "message": message,
    }
    if data is not None:
        response["data"] = data
    else:
        response["data"] = {}
    return response

def error_response(message: str = "An error occurred", errors: Optional[list] = None) -> Dict[str, Any]:
    """Standard error API response format."""
    response = {
        "success": False,
        "message": message,
    }
    if errors is not None:
        response["errors"] = errors
    else:
        response["errors"] = []
    return response
