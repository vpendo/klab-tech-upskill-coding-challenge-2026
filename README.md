# Task Manager — kLab Tech Upskill

Full-stack task app: **React + TypeScript** → **Axios** → **FastAPI** → **SQLite**.

```text
Frontend/   React UI (pnpm)     →  see Frontend/README.md
Backend/    FastAPI + SQLite    →  see Backend/README.md
```

## Quick start

Use **two terminals**. Git Bash: activate the venv with `source .venv/Scripts/activate` (forward slashes).

**1. API**

```bash
cd Backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. UI**

```bash
cd Frontend
pnpm install
pnpm dev
```

- App: http://localhost:5173
- API docs: http://127.0.0.1:8000/docs

SQLite file `tasks.db` is created on API start. `.venv` and `node_modules` are not pushed to GitHub.

## Challenge features

View, create, edit, delete tasks; mark Pending/Completed; filter by status.

Task fields: `id`, `title`, `description`, `status`, `priority`, `createdAt`.
