"""SQLAlchemy ORM models."""

from sqlalchemy import Column, Integer, String, Text

from database import Base


class Algorithm(Base):
    """Algorithm table storing DSA algorithm metadata and sample code."""

    __tablename__ = "algorithms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    difficulty = Column(String(20), nullable=False)
    time_complexity = Column(String(50), nullable=False)
    space_complexity = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    sample_code_python = Column(Text, nullable=False)

    def __repr__(self) -> str:
        return f"<Algorithm(slug='{self.slug}', name='{self.name}')>"
