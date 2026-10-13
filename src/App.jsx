import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Add a new task
  function addTask() {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: task.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  }

  // Mark a task as completed
  function completeTask(id) {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, completed: true } : item,
      ),
    );
  }

  // Delete a task
  function deleteTask(id) {
    setTasks(tasks.filter((item) => item.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  }

  // Start editing a task
  function startEdit(item) {
    setEditingId(item.id);
    setEditText(item.title);
  }

  // Save the edited task
  function saveEdit(id) {
    if (editText.trim() === "") return;

    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, title: editText.trim() } : item,
      ),
    );

    setEditingId(null);
    setEditText("");
  }

  // Filter tasks
  const filteredTasks = tasks.filter((item) => {
    if (filter === "Pending") {
      return !item.completed;
    }

    if (filter === "Completed") {
      return item.completed;
    }

    return true;
  });

  const pendingCount = tasks.filter((item) => !item.completed).length;

  const completedCount = tasks.filter((item) => item.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <main className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            MY WORKSPACE
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Daily Tasks
          </h1>

          <p className="mt-2 text-slate-500">
            Organize your day, one task at a time.
          </p>
        </header>

        {/* Summary cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {tasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-700">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm text-emerald-700">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">
              {completedCount}
            </p>
          </div>
        </section>

        {/* Task list */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Your task list
          </h2>

          {/* Filter buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            {["All", "Pending", "Completed"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === option
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Add task form */}
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
          >
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What do you need to do?"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              + Add Task
            </button>
          </form>

          {/* Task items */}
          <div className="mt-6 space-y-3">
            {tasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
                <p className="font-medium text-slate-700">No tasks yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Add your first task to get started.
                </p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                No {filter.toLowerCase()} tasks found.
              </div>
            ) : (
              filteredTasks.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col gap-3 rounded-xl border border-slate-200 border-l-4 ${
                    item.completed ? "border-l-green-500" : "border-l-blue-500"
                  } bg-white p-4 transition duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between`}
                >
                  {/* Task title and status */}
                  <div className="min-w-0 flex-1 text-left">
                    {editingId === item.id ? (
                      <input
                        autoFocus
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(item.id);
                          }
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditText("");
                          }
                        }}
                        className="w-full rounded-lg border border-blue-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    ) : (
                      <p
                        className={`break-words font-medium ${
                          item.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-800"
                        }`}
                      >
                        {item.title}
                      </p>
                    )}

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        item.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  {/* Task action buttons */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {editingId === item.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEdit(item.id)}
                          disabled={!editText.trim()}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditText("");
                          }}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {!item.completed && (
                          <button
                            type="button"
                            onClick={() => completeTask(item.id)}
                            className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Complete
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTask(item.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
