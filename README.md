# Task Management System

A full-stack web app for managing tasks. A manager can **view**, **create**, **search**, **edit**, **delete**, **filter by status**, and **mark Pending or Completed**.

```text
React + TypeScript + Tailwind   Frontend
              ↓ Axios
FastAPI REST API                Backend
              ↓ SQLAlchemy
SQLite (tasks.db)               Database
```

## Technologies used

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Axios |
| Backend | Python 3.11, FastAPI, Uvicorn, SQLAlchemy |
| Database | SQLite (`Backend/tasks.db`, created automatically) |
| Package manager | pnpm (frontend), pip (backend) |

More detail: `Frontend/README.md` and `Backend/README.md`.

## Live demo

| Part | URL |
|---|---|
| App (Netlify) | https://pendotaskmanager.netlify.app/ |
| API (Render) | https://klab-tech-upskill-coding-challenge-2026-uyb8.onrender.com/ |
| API docs | https://klab-tech-upskill-coding-challenge-2026-uyb8.onrender.com/docs |

The Netlify site calls the Render API. The first request after idle may take ~30 seconds while Render wakes up.

## Challenge checklist

| Requirement | How it works |
|---|---|
| View all tasks | Table loaded from `GET /tasks` |
| Create a task | Left form → `POST /tasks` |
| Edit a task | **Edit** loads `GET /tasks/:id`, save uses `PUT /tasks/:id` |
| Delete a task | **Delete** → `DELETE /tasks/:id` |
| Mark Pending / Completed | **Mark completed** / **Mark pending** → `PUT /tasks/:id` |
| Filter by status | All / Pending / Completed → `GET /tasks?status=` |
| Search | Search box → `GET /tasks?q=` |
| Task fields | `id`, `title`, `description`, `status`, `priority`, `createdAt` |
| Database | SQLite file, no extra server |

### Extra (optional in the brief)

- Form validation (title at least 3 characters, description max 500)
- Improved UI/UX
- API docs: https://klab-tech-upskill-coding-challenge-2026-uyb8.onrender.com/docs

## How to set up the database

You do **not** install MySQL or PostgreSQL. SQLite is one file.

When you start the API the first time, FastAPI creates `Backend/tasks.db` and a `tasks` table. That file is gitignored.

## Full project steps (two terminals)

You need **Python 3.11+**, **Node.js**, and **pnpm**. On Windows Git Bash, use forward slashes.

### Step 1 — Backend (API + database)

```bash
cd Backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

On PowerShell instead of Git Bash:

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Check:

- API: http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs

Keep this terminal open.

### Step 2 — Frontend (UI)

Open a **second** terminal:

```bash
cd Frontend
pnpm install
pnpm dev
```

Open http://localhost:5173

### Step 3 — Use the app

1. Fill **Title**, **Description**, **Status**, **Priority** → **Create task**
2. Find a row in the table (or use **Search**)
3. Filter **All / Pending / Completed**
4. **Edit** then **Save changes**
5. **Mark completed** or **Mark pending**
6. **Delete** if you no longer need the task

## Project folders

```text
Backend/     FastAPI + SQLite
  database.py
  models.py
  schemas.py
  main.py
  requirements.txt
Frontend/    React UI
  src/App.tsx      screens
  src/api.ts       Axios (CRUD)
  src/types.ts     task fields
```

## Technical decisions

- SQLite so the project runs without a hosted database.
- CORS so the UI (localhost and https://pendotaskmanager.netlify.app) can call the API.
- Search and status filter are query params on `GET /tasks`.
- `.venv`, `node_modules`, and `tasks.db` are not committed.
