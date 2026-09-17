"""
schemas.py
----------
This file is STEP 3 of the backend: "what JSON goes in and out of the API?"

SQLAlchemy models (models.py) = database rows.
Pydantic schemas (this file)   = request/response JSON.

We keep them separate so the API contract stays clear.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    """JSON body for POST /tasks (create a task)."""

    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    status: str = "Pending"
    priority: str = "Medium"


class TaskUpdate(BaseModel):
    """
    JSON body for PUT /tasks/{id} (edit a task).
    Every field is optional so the frontend can send only what changed,
    or send the full task.
    """

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None


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
