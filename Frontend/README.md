# Frontend — React + TypeScript

UI for the kLab Task Manager. Uses **pnpm** and **Axios**.

## Stack

- React 19 + TypeScript
- Vite
- Axios (calls FastAPI on port 8000)

## Setup

```bash
cd Frontend
pnpm install
```

Axios is already listed in `package.json`. Do not commit `node_modules`.

## Run

Start the **backend first** (see `Backend/README.md`), then:

```bash
pnpm dev
```

Open http://localhost:5173

## What the UI does

- View all tasks
- Create a task
- Edit a task
- Delete a task
- Mark Pending or Completed
- Filter by status

## Files

| File | Role |
|---|---|
| `src/types.ts` | Task fields in TypeScript |
| `src/api.ts` | Axios wrappers for each REST endpoint |
| `src/App.tsx` | Form + list + filters |
| `src/App.css` | Layout and colors |
