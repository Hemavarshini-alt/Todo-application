import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [dark, setDark] = useState(false);

  const API_URL =
    "https://todo-application-backend-dvt7.onrender.com/todolist";

  // Fetch tasks
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setList(data))
      .catch((err) => console.log(err));
  }, []);

  // Add Task
  const addTask = () => {
    if (task.trim() === "") {
      alert("Please enter a task");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: task }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setList([...list, newTask]);
        setTask("");
      });
  };

  // Complete Task
  const complete = (id, status) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !status }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        const updatedList = list.map((item) =>
          item._id === id ? updatedTask : item
        );
        setList(updatedList);
      });
  };

  // Delete Task
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => {
      const newList = list.filter((item) => item._id !== id);
      setList(newList);
    });
  };

  const totalTasks = list.length;
  const completedTasks = list.filter((item) => item.status).length;

  return (
    <div className={`container ${dark ? "dark" : ""}`}>
      <h1>📝 My To-Do List</h1>

      <div className="input-area">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button onClick={addTask}>Add</button>

        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <ul>
        {list.map((item) => (
          <li key={item._id}>
            
            {/* ✅ BLUE TICK BUTTON */}
            <button
              className={`complete-btn ${
                item.status ? "marked" : ""
              }`}
              onClick={() => complete(item._id, item.status)}
            >
              ✔
            </button>

            {/* TASK TEXT */}
            <span className={item.status ? "completed" : ""}>
              {item.userTask}
            </span>

            {/* ✅ RED DELETE BUTTON */}
            <button
              className="delete-btn"
              onClick={() => deleteTask(item._id)}
            >
              Delete
            </button>

          </li>
        ))}
      </ul>

      <div className="stats">
        <span>Total: {totalTasks}</span>
        <span>Completed: {completedTasks}</span>
      </div>
    </div>
  );
}

export default App;