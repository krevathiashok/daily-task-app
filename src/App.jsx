import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    setTasks([...tasks, task]);
    setTask("");
  }

  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} />

      <button onClick={addTask}>Add Task</button>
      {tasks.map((item) => (
        <p>Task : {item}</p>
      ))}
    </div>
  );
}

export default App;
