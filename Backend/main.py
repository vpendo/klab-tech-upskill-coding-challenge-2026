"""
main.py
-------
This file is STEP 4 of the backend: the REST API itself.

Challenge endpoints:
  GET    /tasks
  GET    /tasks/:id
  POST   /tasks
  PUT    /tasks/:id
  DELETE /tasks/:id

Extra (optional, still useful):
  GET /tasks?status=Pending  -> filter by status
  FastAPI auto docs at /docs
"""

import os
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Task
from schemas import TaskCreate, TaskRead, TaskUpdate

# Create the SQLite table if it does not exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="kLab Task Manager API",
    description="REST API for the kLab Tech Upskill coding challenge.",
    version="1.0.0",
)

# CORS: local Vite + the live Netlify site. Extra origins: CORS_ORIGINS=url1,url2
_default_origins = (
    "http://localhost:5173,"
    "http://127.0.0.1:5173,"
    "https://pendotaskmanager.netlify.app"
)
allow_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_STATUSES = {"Pending", "Completed"}
ALLOWED_PRIORITIES = {"Low", "Medium", "High"}


def _validate_status_and_priority(status: Optional[str], priority: Optional[str]) -> None:
    if status is not None and status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"status must be one of: {sorted(ALLOWED_STATUSES)}",
        )
    if priority is not None and priority not in ALLOWED_PRIORITIES:
        raise HTTPException(
            status_code=400,
            detail=f"priority must be one of: {sorted(ALLOWED_PRIORITIES)}",
        )


@app.get("/")
def root():
    """Simple health check so you can open http://127.0.0.1:8000 in a browser."""
    return {"message": "Task Manager API is running. Open /docs to try the endpoints."}


@app.get("/tasks", response_model=List[TaskRead])
def get_all_tasks(
    status: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    GET /tasks
    GET /tasks?status=Pending
    GET /tasks?q=readme
    """
    query = db.query(Task)
    if status is not None:
        _validate_status_and_priority(status, None)
        query = query.filter(Task.status == status)
    if q:
        like = f"%{q.strip()}%"
        query = query.filter((Task.title.ilike(like)) | (Task.description.ilike(like)))
    return query.order_by(Task.created_at.desc()).all()


@app.get("/tasks/{task_id}", response_model=TaskRead)
def get_one_task(task_id: int, db: Session = Depends(get_db)):
    """GET /tasks/:id — return one task, or 404 if the id does not exist."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks", response_model=TaskRead, status_code=201)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    """POST /tasks — create a new task from JSON { title, description, status, priority }."""
    _validate_status_and_priority(payload.status, payload.priority)
    task = Task(
        title=payload.title.strip(),
        description=payload.description.strip(),
        status=payload.status,
        priority=payload.priority,
    )
    db.add(task)
    db.commit()
    db.refresh(task)  # load the new id and created_at from SQLite
    return task


@app.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    """PUT /tasks/:id — edit title/description/status/priority (used for edit + mark complete)."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    _validate_status_and_priority(payload.status, payload.priority)

    if payload.title is not None:
        task.title = payload.title.strip()
    if payload.description is not None:
        task.description = payload.description.strip()
    if payload.status is not None:
        task.status = payload.status
    if payload.priority is not None:
        task.priority = payload.priority

    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """DELETE /tasks/:id — remove the task from SQLite."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted", "id": task_id}
