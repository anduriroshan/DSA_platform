"""Code execution endpoint."""

from fastapi import APIRouter, HTTPException

from models.schemas import CodeExecutionRequest, CodeExecutionResponse
from services.code_executor import execute_python_code

router = APIRouter(prefix="/api", tags=["execute"])


@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """
    Execute user-submitted code in a sandboxed subprocess.

    Currently only Python is supported.
    """
    # Validate language
    if request.language.lower() != "python":
        raise HTTPException(
            status_code=400,
            detail=f"Language '{request.language}' is not supported. Only 'python' is available.",
        )

    # Validate code is not empty after stripping
    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="Code cannot be empty.",
        )

    # Execute the code
    result = execute_python_code(code=request.code, stdin=request.stdin)

    return CodeExecutionResponse(**result)
