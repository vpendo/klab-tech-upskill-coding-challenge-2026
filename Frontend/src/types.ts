/**
 * Defines the TypeScript types used for tasks.
 *
 * Keeps the frontend types in sync with the FastAPI backend.
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
