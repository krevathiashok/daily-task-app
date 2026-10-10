import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    if (task.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  }
  function deleteTask(id) {
    setTasks(tasks.filter((item) => item.id !== id));
  }

  function completeTask(id) {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, completed: true } : item,
      ),
    );
  }

  return (
    <div>
      <h2>My Daily Task App</h2>
      <p>Total Tasks: {tasks.length}</p>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task"
      />

      <button onClick={addTask}>Add Task</button>

      {tasks.map((item) => (
        <div key={item.id}>
          <p>
            Task: {item.title} — {item.completed ? "Completed" : "Pending"}
          </p>

          {!item.completed && (
            <button onClick={() => completeTask(item.id)}>Mark Complete</button>
          )}
          <button onClick={() => deleteTask(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
