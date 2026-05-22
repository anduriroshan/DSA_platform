"""Health check endpoint."""

from fastapi import APIRouter

from models.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Return the health status of the API."""
    return HealthResponse(
        status="ok",
        message="DSA Platform API is running.",
    )
