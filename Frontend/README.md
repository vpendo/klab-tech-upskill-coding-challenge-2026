# Frontend — Pinboard (React + TypeScript + Tailwind)

A cork-and-sticky-note desk instead of a generic admin table.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Axios → FastAPI on port 8000

## Setup

```bash
cd Frontend
pnpm install
pnpm add -D tailwindcss @tailwindcss/vite   # already in package.json after first install
pnpm dev
```

Start the backend first (`Backend/README.md`). App: http://localhost:5173

## Challenge features in the UI

| Requirement | On the pinboard |
|---|---|
| View all tasks | Sticky notes on the cork |
| Create | “New sticky” / **Pin to board** |
| Edit | **Rewrite** |
| Delete | **Pull off** |
| Pending / Completed | **Mark done** / **Reopen** |
| Filter by status | Whole board · Pending · Completed |

Colours: **coral** = high, **sun** = medium, **sky** = low, faded paper = completed.

Search is extra (filters the notes already loaded).
