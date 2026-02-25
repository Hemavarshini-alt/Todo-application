import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showTodo, setShowTodo] = useState(false);
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [quote, setQuote] = useState("");

  const API_URL =
    "https://todo-application-backend-dvt7.onrender.com/todolist";

  // 🌟 Motivational Quotes
  const quotes = [
    "Small steps every day lead to big success.",
    "Discipline is choosing what you want most.",
    "Your future is created by what you do today.",
    "Dream big. Start small. Act now.",
    "Stay focused and never give up.",
    "Progress, not perfection.",
    "Consistency beats motivation."
  ];

  // Pick Random Quote
  const getRandomQuote = () => {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  };

  // Fetch tasks when entering app
  useEffect(() => {
    if (showTodo) {
      getRandomQuote();

      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => setList(data))
        .catch((err) => console.log(err));
    }
  }, [showTodo]);

  // Add Task
  const addTask = () => {
    if (task.trim() === "") return;

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
        setList(
          list.map((item) =>
            item._id === id ? updatedTask : item
          )
        );
      });
  };

  // Delete Task
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setList(list.filter((item) => item._id !== id));
      });
  };

  // Start Edit
  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  // Save Edit
  const saveEdit = (id) => {
    if (editText.trim() === "") return;

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: editText }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setList(
          list.map((item) =>
            item._id === id ? updatedTask : item
          )
        );
        setEditId(null);
        setEditText("");
      });
  };

  const totalTasks = list.length;
  const completedTasks = list.filter((item) => item.status).length;

  // ================= WELCOME SCREEN =================
  if (!showTodo) {
    return (
      <div className="welcome">
        <h1 className="jello">Welcome to TODOLIST</h1>
        <p className="quote">"Read • Learn • Smile"</p>
        <button className="start-btn" onClick={() => setShowTodo(true)}>
          Enter To-Do App
        </button>
      </div>
    );
  }

  // ================= TODO APP =================
  return (
    <div className="container">
      <h1>📝 My To-Do List</h1>

      {/* 🌟 Random Quote Section */}
      <p className="daily-quote">"{quote}"</p>

      <div className="input-area">
        <input
          type="text"
          placeholder="Add new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {list.map((item) => (
          <li key={item._id}>
            <button
              className={`complete-btn ${item.status ? "marked" : ""}`}
              onClick={() => complete(item._id, item.status)}
            >
              ✔
            </button>

            {editId === item._id ? (
              <>
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  className="save-btn"
                  onClick={() => saveEdit(item._id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span className={item.status ? "completed" : ""}>
                  {item.userTask}
                </span>

                <div className="btn-group">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      startEdit(item._id, item.userTask)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
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