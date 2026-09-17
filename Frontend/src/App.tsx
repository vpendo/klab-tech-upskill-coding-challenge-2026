/**
 * Task Management System.
 * CRUD: create, view, update, delete. Also filter, search, mark status.
 */

import { useEffect, useState, type FormEvent } from "react";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "./api";
import type { Task, TaskPriority, TaskStatus } from "./types";

type Filter = "All" | TaskStatus;

type FieldErrors = {
  title?: string;
  description?: string;
};

const emptyForm = {
  title: "",
  description: "",
  status: "Pending" as TaskStatus,
  priority: "Medium" as TaskPriority,
};

function validateForm(title: string, description: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!title) errors.title = "Title is required.";
  else if (title.length < 3) errors.title = "Use at least 3 characters.";
  else if (title.length > 200) errors.title = "Title must be 200 characters or less.";
  if (description.length > 500) {
    errors.description = "Description must be 500 characters or less.";
  }
  return errors;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  async function loadTasks(nextFilter: Filter = filter, nextQuery = debouncedSearch) {
    try {
      setError("");
      const data = await getTasks(nextFilter, nextQuery);
      setTasks(data);
    } catch {
      setError("Cannot reach the server. Make sure the API is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    void loadTasks(filter, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedSearch]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    const nextErrors = validateForm(title, description);
    setFieldErrors(nextErrors);
    if (nextErrors.title || nextErrors.description) return;

    try {
      setError("");
      if (editingId === null) {
        await createTask({ ...form, title, description });
      } else {
        await updateTask(editingId, { ...form, title, description });
        setEditingId(null);
      }
      setForm(emptyForm);
      setFieldErrors({});
      await loadTasks();
    } catch {
      setError("Could not save the task. Check the form and try again.");
    }
  }

  async function startEdit(task: Task) {
    try {
      const latest = await getTask(task.id);
      setEditingId(latest.id);
      setFieldErrors({});
      setForm({
        title: latest.title,
        description: latest.description,
        status: latest.status,
        priority: latest.priority,
      });
    } catch {
      setError("Could not load that task.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      if (editingId === id) cancelEdit();
      await loadTasks();
    } catch {
      setError("Could not delete the task.");
    }
  }

  async function toggleStatus(task: Task) {
    const next: TaskStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await updateTask(task.id, { status: next });
      await loadTasks();
    } catch {
      setError("Could not update status.");
    }
  }

  const pendingCount = tasks.filter((task) => task.status === "Pending").length;

  return (
    <div className="min-h-svh">
      <header className="border-b border-navy/10 bg-navy text-sand">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="font-display text-3xl text-white sm:text-4xl">
            Task Management
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-sand/80">
            Create, search, update, and close work in one place.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[340px_1fr]">
        <section className="h-fit rounded-2xl border border-navy/10 bg-white/90 p-6 shadow-[0_18px_40px_rgba(27,58,75,0.08)]">
          <p className="text-xs font-bold uppercase tracking-wide text-clay">
            {editingId === null ? "New task" : "Editing"}
          </p>
          <h2 className="font-display mt-1 text-2xl text-navy">
            {editingId === null ? "Create a task" : `Update task #${editingId}`}
          </h2>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-4" noValidate>
            <label className="grid gap-1 text-sm font-semibold text-navy">
              Title
              <input
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
                }}
                maxLength={200}
                aria-invalid={Boolean(fieldErrors.title)}
                className={`rounded-xl border bg-sand/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-clay/40 ${
                  fieldErrors.title ? "border-red-400" : "border-navy/15"
                }`}
                placeholder="What needs to get done?"
              />
              {fieldErrors.title && (
                <span className="text-xs font-medium text-red-700">{fieldErrors.title}</span>
              )}
            </label>

            <label className="grid gap-1 text-sm font-semibold text-navy">
              Description
              <textarea
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                  if (fieldErrors.description) {
                    setFieldErrors({ ...fieldErrors, description: undefined });
                  }
                }}
                rows={4}
                maxLength={500}
                aria-invalid={Boolean(fieldErrors.description)}
                className={`rounded-xl border bg-sand/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-clay/40 ${
                  fieldErrors.description ? "border-red-400" : "border-navy/15"
                }`}
                placeholder="A short note so you remember why this matters."
              />
              <span className="text-xs font-medium text-navy/50">
                {form.description.length}/500
              </span>
              {fieldErrors.description && (
                <span className="text-xs font-medium text-red-700">
                  {fieldErrors.description}
                </span>
              )}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm font-semibold text-navy">
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as TaskStatus })
                  }
                  className="rounded-xl border border-navy/15 bg-sand/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-clay/40"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold text-navy">
                Priority
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as TaskPriority })
                  }
                  className="rounded-xl border border-navy/15 bg-sand/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-clay/40"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="rounded-xl bg-clay px-4 py-2.5 text-sm font-bold text-white hover:bg-[#a84c1f]"
              >
                {editingId === null ? "Create task" : "Save changes"}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-white/90 p-6 shadow-[0_18px_40px_rgba(27,58,75,0.08)]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-navy">All tasks</h2>
              <p className="text-sm text-navy/60">
                {loading ? "Loading…" : `${tasks.length} shown · ${pendingCount} pending`}
              </p>
            </div>
            <label className="sr-only" htmlFor="task-search">
              Search tasks
            </label>
            <input
              id="task-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or description…"
              className="w-full max-w-sm rounded-full border border-navy/15 bg-sand/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-clay/40"
            />
          </div>

          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {(["All", "Pending", "Completed"] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={
                  filter === value
                    ? "rounded-full bg-navy px-4 py-1.5 text-sm font-bold text-white"
                    : "rounded-full bg-sand px-4 py-1.5 text-sm font-semibold text-navy hover:bg-sand/70"
                }
              >
                {value}
              </button>
            ))}
          </div>

          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-navy/60">Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl bg-sand/80 px-5 py-8">
              <p className="font-display text-xl text-navy">Nothing here yet.</p>
              <p className="mt-1 text-sm text-navy/70">
                {debouncedSearch
                  ? "Try another search, or clear the box to see every task."
                  : "Create the first task on the left. A clear title is enough to start."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-navy/10 text-xs uppercase tracking-wide text-navy/50">
                  <tr>
                    <th className="py-3 pr-3 font-bold">ID</th>
                    <th className="py-3 pr-3 font-bold">Title</th>
                    <th className="py-3 pr-3 font-bold">Description</th>
                    <th className="py-3 pr-3 font-bold">Status</th>
                    <th className="py-3 pr-3 font-bold">Priority</th>
                    <th className="py-3 pr-3 font-bold">Created</th>
                    <th className="py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-navy/5 hover:bg-sand/40">
                      <td className="py-3.5 pr-3 text-navy/50">{task.id}</td>
                      <td className="py-3.5 pr-3 font-bold text-navy">{task.title}</td>
                      <td className="max-w-[220px] py-3.5 pr-3 text-navy/70">
                        {task.description || "—"}
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={
                            task.status === "Completed"
                              ? "rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-bold text-leaf"
                              : "rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold"
                          }
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={
                            task.priority === "High"
                              ? "font-bold text-clay"
                              : task.priority === "Low"
                                ? "font-semibold text-navy/60"
                                : "font-semibold text-navy"
                          }
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-3.5 pr-3 text-navy/55">
                        {new Date(task.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => toggleStatus(task)}
                            className="text-xs font-bold text-leaf hover:underline"
                          >
                            {task.status === "Pending" ? "Mark completed" : "Mark pending"}
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(task)}
                            className="text-xs font-bold text-navy hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(task.id)}
                            className="text-xs font-bold text-clay hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
