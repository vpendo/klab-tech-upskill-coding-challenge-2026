# Frontend — Task Management

Web UI so a manager can add, search, update, and delete tasks.

## Technologies used

| Technology | Role |
|---|---|
| React 19 | UI |
| TypeScript | Types |
| Vite | Dev server and build |
| Tailwind CSS | Layout and colours |
| Axios | HTTP client to FastAPI |
| pnpm | Install packages |

## How to install and run

Start the backend first (`Backend/README.md`), then:

```bash
cd Frontend
pnpm install
pnpm dev
```

Open http://localhost:5173

The UI calls `http://127.0.0.1:8000` locally. On Netlify it calls the Render API.

Live app: https://pendotaskmanager.netlify.app/

After changing API URL or CORS, **redeploy both** (push to GitHub so Netlify and Render rebuild).

## What you can do (CRUD)

| Action | In the UI |
|---|---|
| Create | Form → **Create task** (`POST /tasks`) |
| Read all | Task table (`GET /tasks`) |
| Read one | **Edit** (`GET /tasks/:id`) |
| Update | **Save changes** or **Mark completed** (`PUT /tasks/:id`) |
| Delete | **Delete** (`DELETE /tasks/:id`) |
| Search | Search box (`GET /tasks?q=`) |
| Filter | All / Pending / Completed |

## Files

| File | Role |
|---|---|
| `src/types.ts` | Task fields |
| `src/api.ts` | Axios CRUD calls |
| `src/App.tsx` | Form, search, table |
| `src/index.css` | Tailwind theme |
