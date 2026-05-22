"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional


# ─── Code Execution ───────────────────────────────────────────────

class CodeExecutionRequest(BaseModel):
    """Request body for POST /api/execute."""
    code: str = Field(..., min_length=1, max_length=10000, description="Python code to execute")
    language: str = Field(default="python", description="Programming language (only 'python' supported)")
    stdin: str = Field(default="", description="Standard input to feed to the program")


class CodeExecutionResponse(BaseModel):
    """Response body for POST /api/execute."""
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: float
    error: Optional[str] = None
    frames: list = []


# ─── Algorithms ───────────────────────────────────────────────────

class AlgorithmSummary(BaseModel):
    """Algorithm list item (no sample code)."""
    slug: str
    name: str
    category: str
    difficulty: str
    time_complexity: str
    space_complexity: str
    description: str

    model_config = {"from_attributes": True}


class AlgorithmDetail(AlgorithmSummary):
    """Full algorithm detail including sample code."""
    sample_code_python: str

    model_config = {"from_attributes": True}


# ─── Health ───────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    """Response for GET /api/health."""
    status: str
    message: str
