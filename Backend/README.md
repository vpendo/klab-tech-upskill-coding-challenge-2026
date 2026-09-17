# Backend — Task Management API

REST API that stores tasks in SQLite.

## Technologies used

| Technology | Role |
|---|---|
| Python 3.11 | Language |
| FastAPI | REST API |
| Uvicorn | Server |
| SQLAlchemy | Database access |
| SQLite | Database file (`tasks.db`) |
| Pydantic | Request/response validation |
| pip | Install packages |

## How to install and run

Git Bash (Windows):

```bash
cd Backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

PowerShell:

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- API: http://127.0.0.1:8000
- Interactive docs: http://127.0.0.1:8000/docs
- Live API: https://klab-tech-upskill-coding-challenge-2026-uyb8.onrender.com/
- Live docs: https://klab-tech-upskill-coding-challenge-2026-uyb8.onrender.com/docs

Keep this process running while you use the frontend.

## How to set up the database

No extra database install. On first start, FastAPI creates `tasks.db` in this folder. Do not commit that file.

## CRUD endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/tasks` | Read all (`?status=Pending`, `?q=search`) |
| GET | `/tasks/{id}` | Read one |
| POST | `/tasks` | Create |
| PUT | `/tasks/{id}` | Update (edit or mark status) |
| DELETE | `/tasks/{id}` | Delete |

## Files

| File | Role |
|---|---|
| `database.py` | SQLite connection |
| `models.py` | Table: id, title, description, status, priority, createdAt |
| `schemas.py` | JSON validation |
| `main.py` | Routes |
| `requirements.txt` | Python packages |
