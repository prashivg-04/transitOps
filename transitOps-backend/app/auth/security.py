"""
app.auth.security
~~~~~~~~~~~~~~~~~
Facade module re-exporting core authentication utilities for easier imports.
"""

from app.auth.password import get_password_hash, verify_password
from app.auth.jwt import create_access_token, create_refresh_token, decode_token
from app.auth.dependencies import get_current_user, get_current_active_user, RoleChecker
from app.auth.oauth2 import oauth2_scheme

__all__ = [
    "get_password_hash",
    "verify_password",
    "create_access_token",
    "create_refresh_token",
    "decode_token",
    "get_current_user",
    "get_current_active_user",
    "RoleChecker",
    "oauth2_scheme"
]
