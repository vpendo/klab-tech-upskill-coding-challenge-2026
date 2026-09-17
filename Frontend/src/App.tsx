/**
 * Pinboard UI — cork wall + sticky notes (not a generic dashboard).
 * Still covers every challenge action:
 * view, create, edit, delete, mark Pending/Completed, filter by status.
 */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api";
import type { Task, TaskPriority, TaskStatus } from "./types";

type Filter = "All" | TaskStatus;

const emptyForm = {
  title: "",
  description: "",
  status: "Pending" as TaskStatus,
  priority: "Medium" as TaskPriority,
};

const TILT = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-[1.4deg]"];

function stickyClass(task: Task) {
  if (task.status === "Completed") {
    return "bg-[#e8e1d1] text-stone-600";
  }
  if (task.priority === "High") return "bg-[#ffd6c9]";
  if (task.priority === "Low") return "bg-[#d7eef4]";
  return "bg-[#ffe9a8]";
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadTasks(nextFilter: Filter = filter) {
    try {
      setError("");
      const data = await getTasks(nextFilter);
      setTasks(data);
    } catch {
      setError(
        "The pinboard cannot reach FastAPI. In Backend run: uvicorn main:app --reload --port 8000"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    void loadTasks(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q)
    );
  }, [tasks, query]);

  const openCount = tasks.filter((t) => t.status === "Pending").length;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Give the note a title — even a short one.");
      return;
    }

    try {
      setError("");
      if (editingId === null) {
        await createTask({ ...form, title });
      } else {
        await updateTask(editingId, { ...form, title });
        setEditingId(null);
      }
      setForm(emptyForm);
      await loadTasks();
    } catch {
      setError("Could not save that note. Is the API still running?");
    }
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Pull this note off the board?")) return;
    try {
      await deleteTask(id);
      if (editingId === id) cancelEdit();
      await loadTasks();
    } catch {
      setError("Could not remove the note.");
    }
  }

  async function toggleStatus(task: Task) {
    const next: TaskStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await updateTask(task.id, { status: next });
      await loadTasks();
    } catch {
      setError("Could not change the status.");
    }
  }

  return (
    <div className="min-h-svh px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start">
        <aside className="paper-lines rounded-sm bg-[#fffaf1] p-6 shadow-[8px_10px_0_rgba(42,33,24,0.18)] ring-1 ring-stone-800/10">
          <p className="text-[11px] font-extrabold tracking-[0.22em] text-[#b08968] uppercase">
            kLab · Tech Upskill
          </p>
          <h1 className="font-display mt-2 text-4xl leading-none text-ink">
            Pinboard
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Write it down. Pin it. Cross it off. A small desk for real work —
            not another grey admin table.
          </p>

          <p className="mt-4 inline-block -rotate-1 bg-[#ffe9a8] px-3 py-1 text-xs font-extrabold text-ink shadow-sm">
            {openCount} still open
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
            <h2 className="font-display text-xl">
              {editingId === null ? "New sticky" : `Rewriting note #${editingId}`}
            </h2>

            <label className="grid gap-1 text-xs font-extrabold uppercase tracking-wide text-stone-500">
              Title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Call the mentor. Ship the README…"
                maxLength={200}
                className="rounded-sm border-0 border-b-2 border-stone-300 bg-transparent px-0 py-2 text-base font-bold text-ink outline-none placeholder:font-medium placeholder:text-stone-400 focus:border-[#e07a5f]"
              />
            </label>

            <label className="grid gap-1 text-xs font-extrabold uppercase tracking-wide text-stone-500">
              Why it matters
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="A sentence for future-you."
                rows={3}
                className="rounded-sm border border-dashed border-stone-300 bg-[#fff6e8] px-3 py-2 text-sm font-medium text-ink outline-none focus:border-[#7d9b76]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs font-extrabold uppercase tracking-wide text-stone-500">
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as TaskStatus })
                  }
                  className="rounded-sm border border-stone-300 bg-white px-2 py-2 text-sm font-bold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
              <label className="grid gap-1 text-xs font-extrabold uppercase tracking-wide text-stone-500">
                Priority
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as TaskPriority })
                  }
                  className="rounded-sm border border-stone-300 bg-white px-2 py-2 text-sm font-bold"
                >
                  <option value="Low">Low · sky</option>
                  <option value="Medium">Medium · sun</option>
                  <option value="High">High · coral</option>
                </select>
              </label>
            </div>

            <div className="mt-1 flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-sm bg-[#e07a5f] px-4 py-2 text-sm font-extrabold text-white shadow-[3px_3px_0_#2a2118] hover:translate-y-px"
              >
                {editingId === null ? "Pin to board" : "Save rewrite"}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-3 py-2 text-sm font-bold text-stone-500 underline decoration-dotted"
                >
                  Leave it
                </button>
              )}
            </div>
          </form>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl text-[#fff8ee] drop-shadow-sm">
                On the cork
              </h2>
              <p className="text-sm font-bold text-stone-800/70">
                Filter by status. Colour = priority. Tick = done.
              </p>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the board…"
              className="w-full max-w-xs rounded-sm bg-[#fffaf1]/90 px-3 py-2 text-sm font-bold text-ink outline-none ring-1 ring-stone-800/15 placeholder:font-medium sm:w-56"
            />
          </div>

          <div
            className="mb-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by status"
          >
            {(["All", "Pending", "Completed"] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={
                  filter === value
                    ? "rounded-sm bg-ink px-3 py-1.5 text-sm font-extrabold text-[#ffe9a8]"
                    : "rounded-sm bg-[#fffaf1]/70 px-3 py-1.5 text-sm font-extrabold text-ink hover:bg-[#fffaf1]"
                }
              >
                {value === "All" ? "Whole board" : value}
              </button>
            ))}
          </div>

          {error && (
            <p className="mb-4 rounded-sm bg-[#fff1ea] px-3 py-2 text-sm font-bold text-[#9a3412] shadow-sm">
              {error}
            </p>
          )}

          {loading ? (
            <p className="font-display text-2xl text-[#fff8ee]">Pinning…</p>
          ) : visible.length === 0 ? (
            <div className="max-w-sm -rotate-1 rounded-sm bg-[#fffaf1] p-6 shadow-[6px_8px_0_rgba(42,33,24,0.16)]">
              <p className="font-display text-2xl">Quiet cork.</p>
              <p className="mt-2 text-sm font-medium text-stone-600">
                Nothing here yet. Write a sticky on the left — the first one is
                usually the hardest.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((task) => (
                <li
                  key={task.id}
                  className={`${stickyClass(task)} ${TILT[task.id % TILT.length]} relative p-5 pt-7 shadow-[5px_7px_0_rgba(42,33,24,0.18)] transition hover:rotate-0 hover:z-10`}
                >
                  <span className="absolute left-1/2 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-[#e07a5f] shadow-sm ring-2 ring-white/70" />
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-display text-xl leading-tight ${
                        task.status === "Completed" ? "line-through decoration-2" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider">
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-2 text-sm font-medium leading-snug">
                      {task.description}
                    </p>
                  )}
                  <p className="mt-3 text-[11px] font-extrabold uppercase tracking-wide opacity-70">
                    #{task.id} · {task.status} · {formatWhen(task.createdAt)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleStatus(task)}
                      className="rounded-sm bg-ink/90 px-2 py-1 text-[11px] font-extrabold text-[#fff8ee]"
                    >
                      {task.status === "Pending" ? "Mark done" : "Reopen"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="rounded-sm bg-white/70 px-2 py-1 text-[11px] font-extrabold"
                    >
                      Rewrite
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="rounded-sm px-2 py-1 text-[11px] font-extrabold text-red-800"
                    >
                      Pull off
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
