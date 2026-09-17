# Backend — FastAPI + SQLite

REST API for the kLab Task Manager.

## Stack

- Python 3.11
- FastAPI
- SQLAlchemy
- SQLite (`tasks.db` is created automatically)

## Setup (Git Bash on Windows)

```bash
cd Backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

- API: http://127.0.0.1:8000
- Interactive docs: http://127.0.0.1:8000/docs

Keep this terminal open. The React app talks to this port.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/tasks` | List tasks (`?status=Pending` or `?status=Completed` to filter) |
| GET | `/tasks/{id}` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/{id}` | Update a task (edit or mark Pending/Completed) |
| DELETE | `/tasks/{id}` | Delete a task |

## Files

| File | Role |
|---|---|
| `database.py` | Connect to SQLite |
| `models.py` | Table columns |
| `schemas.py` | JSON in / JSON out |
| `main.py` | Routes |
| `requirements.txt` | Python packages |

## Database

No extra database server. On first start, FastAPI creates `tasks.db` in this folder. That file is gitignored.
