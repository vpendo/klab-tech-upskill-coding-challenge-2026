"""
database.py
-----------
This file is STEP 1 of the backend: "connect Python to SQLite".

Challenge requirement: store task data in a database.
We chose SQLite because it is a single file (tasks.db). No extra server to install.
"""

from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Put the .db file next to this Python file, inside the backend folder.
DB_PATH = Path(__file__).resolve().parent / "tasks.db"

# SQLite connection string. "///" means a local file on disk.
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# check_same_thread=False is required for SQLite + FastAPI.
# FastAPI can use the database from more than one thread.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# SessionLocal() creates one "conversation" with the database.
# We open a session per HTTP request, then close it.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All table models (see models.py) inherit from this Base class.
Base = declarative_base()


def get_db():
    """
    FastAPI "dependency": give each request its own DB session,
    then always close it afterwards (even if an error happens).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
