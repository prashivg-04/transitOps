from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response schema."""
    success: bool = True
    message: str = "Success"
    data: List[T]
    page: int
    page_size: int
    total: int
    total_pages: int

def paginate(items: List[T], total: int, skip: int, limit: int) -> dict:
    """Helper to construct paginated dictionary."""
    page = (skip // limit) + 1 if limit > 0 else 1
    total_pages = (total + limit - 1) // limit if limit > 0 else 1
    
    return {
        "success": True,
        "message": "Success",
        "data": items,
        "page": page,
        "page_size": limit,
        "total": total,
        "total_pages": total_pages
    }
