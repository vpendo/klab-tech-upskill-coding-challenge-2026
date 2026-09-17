/**
 * App.tsx
 * -------
 * The whole UI lives here on purpose so you can follow one file:
 *   load list → create → edit → delete → toggle status → filter
 */

import { useEffect, useState, type FormEvent } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api";
import type { Task, TaskPriority, TaskStatus } from "./types";
import "./App.css";

type Filter = "All" | TaskStatus;

const emptyForm = {
  title: "",
  description: "",
  status: "Pending" as TaskStatus,
  priority: "Medium" as TaskPriority,
};

function App() {
  // --- state: what the screen shows ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form: used for BOTH create and edit
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  /** Pull tasks from FastAPI. Called on first load and after every change. */
  async function loadTasks(nextFilter: Filter = filter) {
    try {
      setError("");
      const data = await getTasks(nextFilter);
      setTasks(data);
    } catch {
      setError(
        "Cannot reach the API. Start FastAPI on port 8000:  uvicorn main:app --reload --port 8000"
      );
    } finally {
      setLoading(false);
    }
  }

  // Run once when the page opens (and again if filter changes).
  useEffect(() => {
    setLoading(true);
    void loadTasks(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /** Create (POST) or save edit (PUT). */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Title is required.");
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
      setError("Could not save the task. Check the API is running.");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
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

  /** Challenge: mark a task Pending or Completed (same PUT endpoint as edit). */
  async function toggleStatus(task: Task) {
    const next: TaskStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await updateTask(task.id, { status: next });
      await loadTasks();
    } catch {
      setError("Could not update status.");
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">kLab Tech Upskill · Coding Challenge</p>
        <h1>Task Manager</h1>
        <p className="lede">
          Create, edit, complete, and filter tasks. React talks to FastAPI with Axios;
          FastAPI stores rows in SQLite.
        </p>
      </header>

      {/* CREATE / EDIT FORM */}
      <section className="card">
        <h2>{editingId === null ? "Add a task" : `Edit task #${editingId}`}</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Title <span className="req">*</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Finish the kLab README"
              maxLength={200}
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional details"
              rows={3}
            />
          </label>

          <div className="row">
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as TaskStatus })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label>
              Priority
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as TaskPriority })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <button type="submit" className="primary">
              {editingId === null ? "Create task" : "Save changes"}
            </button>
            {editingId !== null && (
              <button type="button" className="ghost" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {error && <p className="banner error">{error}</p>}

      {/* FILTER + LIST */}
      <section className="card">
        <div className="list-head">
          <h2>All tasks</h2>
          <div className="filters" role="group" aria-label="Filter by status">
            {(["All", "Pending", "Completed"] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "chip active" : "chip"}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks yet. Add one above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task">
                <div>
                  <div className="task-top">
                    <h3 className={task.status === "Completed" ? "done" : ""}>
                      {task.title}
                    </h3>
                    <span className={`badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`badge ${task.status.toLowerCase()}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && <p>{task.description}</p>}
                  <p className="meta">
                    #{task.id} · created {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="task-actions">
                  <button type="button" onClick={() => toggleStatus(task)}>
                    Mark {task.status === "Pending" ? "Completed" : "Pending"}
                  </button>
                  <button type="button" onClick={() => startEdit(task)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
