/**
 * types.ts
 * --------
 * TypeScript version of the challenge Task fields:
 *   id, title, description, status, priority, createdAt
 *
 * Keep this in sync with Backend/schemas.py (TaskRead / TaskCreate).
 */

export type TaskStatus = "Pending" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string; // ISO date string from FastAPI, e.g. "2026-09-17T10:00:00"
};

/** Body for POST /tasks */
export type TaskCreate = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
};

/** Body for PUT /tasks/:id — all fields optional */
export type TaskUpdate = Partial<TaskCreate>;
