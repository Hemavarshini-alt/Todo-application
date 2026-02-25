import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showTodo, setShowTodo] = useState(false);
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [quote, setQuote] = useState("");

  const API_URL =
    "https://todo-application-backend-dvt7.onrender.com/todolist";

  // 🌟 Large Motivational Quotes Collection
  const quotes = [
    "Small steps every day lead to big success.",
    "Discipline is choosing what you want most.",
    "Your future is created by what you do today.",
    "Dream big. Start small. Act now.",
    "Stay focused and never give up.",
    "Progress, not perfection.",
    "Consistency beats motivation.",
    "Success starts with self-belief.",
    "Hard work beats talent when talent doesn't work hard.",
    "Focus on goals, not obstacles.",
    "You are capable of amazing things.",
    "Make today count.",
    "Don't stop until you're proud.",
    "Action is the key to success.",
    "Push yourself, because no one else will."
  ];

  // 🎯 Get Random Quote (No Repeat)
  const getRandomQuote = () => {
    let random;
    do {
      random = Math.floor(Math.random() * quotes.length);
    } while (quotes[random] === quote);

    setQuote(quotes[random]);
  };

  useEffect(() => {
    if (showTodo) {
      fetchTasks();
      getRandomQuote();

      // ⏳ Auto change quote every 10 seconds
      const interval = setInterval(() => {
        getRandomQuote();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [showTodo]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setList(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // ---------------- ADD TASK ----------------
  const addTask = async () => {
    if (!task.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userTask: task.trim() }),
      });

      const newTask = await res.json();
      setList((prev) => [...prev, newTask]);
      setTask("");
      getRandomQuote(); // ✨ change quote when task added
    } catch (err) {
      console.log("Add error:", err);
    }
  };

  // ---------------- COMPLETE TASK ----------------
  const complete = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !status }),
      });

      const updatedTask = await res.json();

      setList((prev) =>
        prev.map((item) =>
          item._id === id ? updatedTask : item
        )
      );

      getRandomQuote(); // ✨ change quote when task completed
    } catch (err) {
      console.log("Complete error:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      setList((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const totalTasks = list.length;
  const completedTasks = list.filter((item) => item.status).length;

  if (!showTodo) {
    return (
      <div className="welcome">
        <h1 className="jello">Welcome to TODOLIST</h1>
        <p className="quote">"Read • Learn • Smile"</p>
        <button className="start-btn" onClick={() => setShowTodo(true)}>
          Enter To-Do App.......
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>📝 My To-Do List</h1>

      <p className="daily-quote">"{quote}"</p>

      <div className="input-area">
        <input
          type="text"
          placeholder="Add new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
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

            <span className={item.status ? "completed" : ""}>
              {item.userTask}
            </span>

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