import uuid
from datetime import datetime

def generate_reference_id(prefix: str = "REF") -> str:
    """Generate a unique reference ID."""
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"

def current_timestamp() -> str:
    """Return the current ISO format timestamp."""
    return datetime.utcnow().isoformat()
