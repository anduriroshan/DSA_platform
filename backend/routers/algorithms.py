"""Algorithm listing and detail endpoints."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import Algorithm
from models.schemas import AlgorithmSummary, AlgorithmDetail

router = APIRouter(prefix="/api", tags=["algorithms"])


@router.get("/algorithms")
async def list_algorithms(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    db: Session = Depends(get_db),
):
    """Return a list of all algorithms with optional filtering."""
    query = db.query(Algorithm)

    if category:
        query = query.filter(Algorithm.category == category.lower())
    if difficulty:
        query = query.filter(Algorithm.difficulty == difficulty.lower())

    algorithms = query.order_by(Algorithm.category, Algorithm.name).all()

    result = []
    for algo in algorithms:
        result.append({
            "slug": algo.slug,
            "name": algo.name,
            "category": algo.category,
            "difficulty": algo.difficulty,
            "time_complexity": algo.time_complexity,
            "space_complexity": algo.space_complexity,
            "description": algo.description,
        })

    return JSONResponse(content=result)


@router.get("/algorithms/{slug}")
async def get_algorithm(slug: str, db: Session = Depends(get_db)):
    """Return full details for a single algorithm by slug."""
    algorithm = db.query(Algorithm).filter(Algorithm.slug == slug).first()

    if not algorithm:
        raise HTTPException(
            status_code=404,
            detail=f"Algorithm with slug '{slug}' not found.",
        )

    return JSONResponse(content={
        "slug": algorithm.slug,
        "name": algorithm.name,
        "category": algorithm.category,
        "difficulty": algorithm.difficulty,
        "time_complexity": algorithm.time_complexity,
        "space_complexity": algorithm.space_complexity,
        "description": algorithm.description,
        "sample_code_python": algorithm.sample_code_python,
    })
