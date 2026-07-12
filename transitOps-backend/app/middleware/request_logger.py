import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.core.logging import logger

class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        logger.info(f"Incoming Request: {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(f"Request failed with exception: {str(e)}")
            raise e
            
        process_time = time.time() - start_time
        logger.info(f"Request Completed: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s")
        return response
