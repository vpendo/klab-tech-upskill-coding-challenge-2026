/**
 * api.ts
 * ------
 * Axios talks to FastAPI. Each function matches one row in the challenge table:
 *
 *   GET    /tasks        → getTasks()
 *   GET    /tasks/:id    → getTask(id)
 *   POST   /tasks        → createTask()
 *   PUT    /tasks/:id    → updateTask()
 *   DELETE /tasks/:id    → deleteTask()
 *
 * FastAPI must be running on port 8000 (see README).
 */

import axios from "axios";
import type { Task, TaskCreate, TaskStatus, TaskUpdate } from "./types";

const LOCAL_API = "http://127.0.0.1:8000";
const LIVE_API = "https://klab-tech-upskill-coding-challenge-2026-uyb8.onrender.com";

function apiBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") return LIVE_API;
  }
  return LOCAL_API;
}

const api = axios.create({
  baseURL: apiBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

/** GET /tasks, GET /tasks?status=Pending, GET /tasks?q=search */
export async function getTasks(
  status?: TaskStatus | "All",
  q?: string
): Promise<Task[]> {
  const params: { status?: string; q?: string } = {};
  if (status && status !== "All") params.status = status;
  if (q?.trim()) params.q = q.trim();
  const response = await api.get<Task[]>("/tasks", { params });
  return response.data;
}

/** GET /tasks/:id */
export async function getTask(id: number): Promise<Task> {
  const response = await api.get<Task>(`/tasks/${id}`);
  return response.data;
}

/** POST /tasks */
export async function createTask(payload: TaskCreate): Promise<Task> {
  const response = await api.post<Task>("/tasks", payload);
  return response.data;
}

/** PUT /tasks/:id  (edit fields OR toggle Pending/Completed) */
export async function updateTask(id: number, payload: TaskUpdate): Promise<Task> {
  const response = await api.put<Task>(`/tasks/${id}`, payload);
  return response.data;
}

/** DELETE /tasks/:id */
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
