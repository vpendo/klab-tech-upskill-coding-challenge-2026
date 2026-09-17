# Keza — Task Management System

Keza (Kinyarwanda for *beautiful / well done*) is a small desk for unfinished work.

React + TypeScript + Tailwind + Axios + FastAPI + SQLite.

```text
Frontend/   React UI (pnpm)   →  Frontend/README.md
Backend/    FastAPI + SQLite  →  Backend/README.md
```

## Features

- View all tasks
- Create a task
- Edit a task
- Delete a task
- Mark a task as Pending or Completed
- Filter tasks by status

Each task has: `id`, `title`, `description`, `status`, `priority`, `createdAt`.

## Extra (challenge optional)

- Form validation (title at least 3 characters, description max 500)
- Search by title or description (`GET /tasks?q=...`)
- Improved UI/UX
- API documentation: FastAPI Swagger UI at http://127.0.0.1:8000/docs (not shown in the app UI)

## How to run

**1. API**

```bash
cd Backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

SQLite file `tasks.db` is created automatically.

**2. UI**

```bash
cd Frontend
pnpm install
pnpm dev
```

- App: http://localhost:5173
- API docs: http://127.0.0.1:8000/docs
