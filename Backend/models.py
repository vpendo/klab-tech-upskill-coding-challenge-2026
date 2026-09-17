"""
models.py
---------
This file is STEP 2 of the backend: "what does a Task look like in the database?"

Challenge fields:
  id, title, description, status, priority, createdAt
"""

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from database import Base


class Task(Base):
    # SQL table name. One row in this table = one task.
    __tablename__ = "tasks"

    # Primary key. SQLite will auto-increment this: 1, 2, 3, ...
    id = Column(Integer, primary_key=True, index=True)

    # Short name of the task (required).
    title = Column(String, nullable=False)

    # Longer details (can be empty string).
    description = Column(String, default="")

    # Challenge: mark as Pending or Completed.
    status = Column(String, nullable=False, default="Pending")

    # Extra field from the challenge: Low / Medium / High.
    priority = Column(String, nullable=False, default="Medium")

    # When the task was first created. Python uses created_at; JSON uses createdAt.
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
