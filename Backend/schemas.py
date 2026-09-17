"""
schemas.py
----------
This file is STEP 3 of the backend: "what JSON goes in and out of the API?"

SQLAlchemy models (models.py) = database rows.
Pydantic schemas (this file)   = request/response JSON.

We keep them separate so the API contract stays clear.
"""

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

Status = Literal["Pending", "Completed"]
Priority = Literal["Low", "Medium", "High"]


class TaskCreate(BaseModel):
    """JSON body for POST /tasks (create a task)."""

    title: str = Field(min_length=3, max_length=200)
    description: str = Field(default="", max_length=500)
    status: Status = "Pending"
    priority: Priority = "Medium"

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 3:
            raise ValueError("title must be at least 3 characters")
        return cleaned


class TaskUpdate(BaseModel):
    """JSON body for PUT /tasks/{id} (edit a task)."""

    title: Optional[str] = Field(default=None, min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    status: Optional[Status] = None
    priority: Optional[Priority] = None

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        cleaned = value.strip()
        if len(cleaned) < 3:
            raise ValueError("title must be at least 3 characters")
        return cleaned


class TaskRead(BaseModel):
    """JSON we send back to React for GET/POST/PUT."""

    # from_attributes: build this schema from a SQLAlchemy Task row.
    # populate_by_name: accept either created_at or createdAt.
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    title: str
    description: str
    status: str
    priority: str
    # DB column is created_at; JSON field name is createdAt (challenge spec).
    createdAt: datetime = Field(validation_alias="created_at", serialization_alias="createdAt")
