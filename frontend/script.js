const task_input = document.getElementById("inp");
const add_btn = document.getElementById("add-btn");
const task_list = document.getElementById("tasklist");

const totalSpan = document.getElementById("total");
const completedSpan = document.getElementById("completed");
const themeToggle = document.getElementById("theme-toggle");

const API_URL = "https://todo-application-backend-dvt7.onrender.com/todolist";

// --------------------
// Update Stats
// --------------------
function updateStats() {
  const tasks = task_list.querySelectorAll("li");
  const completedTasks = task_list.querySelectorAll(".task-text.completed");

  totalSpan.textContent = tasks.length;
  completedSpan.textContent = completedTasks.length;
}

// --------------------
// Load Tasks
// --------------------
window.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    tasks.forEach((task) => {
      create_task_list(task._id, task.userTask, task.status);
    });

    updateStats();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
});

// --------------------
// Add Task
// --------------------
add_btn.addEventListener("click", async function () {
  const input_task = task_input.value.trim();

  if (!input_task) {
    alert("Please enter a task!");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: input_task }),
    });

    const newtask = await res.json();

    create_task_list(newtask._id, newtask.userTask, newtask.status);
    task_input.value = "";
    updateStats();
  } catch (error) {
    console.error("Error adding task:", error);
  }
});

// --------------------
// Create Task Item
// --------------------
function create_task_list(task_id, task_text_db, task_status) {
  const list_item = document.createElement("li");

  const complete_btn = document.createElement("button");
  complete_btn.textContent = "✔";

  const task_text = document.createElement("span");
  task_text.className = "task-text";
  task_text.textContent = task_text_db;

  const edit_btn = document.createElement("button");
  edit_btn.textContent = "Edit";
  edit_btn.className = "edit-btn";

  const delete_btn = document.createElement("button");
  delete_btn.textContent = "Delete";
  delete_btn.className = "delete-btn";

  if (task_status) {
    task_text.classList.add("completed");
  }

  // --------------------
  // Complete Task
  // --------------------
  complete_btn.addEventListener("click", async function () {
    const finished = task_text.classList.contains("completed");

    try {
      const res = await fetch(`${API_URL}/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !finished }),
      });

      if (!res.ok) throw new Error("Update failed");

      task_text.classList.toggle("completed");
      updateStats();
    } catch (error) {
      console.error("Complete update error:", error);
    }
  });

  // --------------------
  // ✅ EDIT TASK (PROPER FIX)
  // --------------------
  edit_btn.addEventListener("click", async function () {
    const updatedText = prompt("Edit your task:", task_text.textContent);

    if (updatedText === null) return;

    const trimmedText = updatedText.trim();

    if (!trimmedText) {
      alert("Task cannot be empty!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userTask: trimmedText }),
      });

      if (!res.ok) throw new Error("Edit failed");

      const updatedTask = await res.json();

      // Update UI with backend response
      task_text.textContent = updatedTask.userTask;
    } catch (error) {
      console.error("Edit error:", error);
      alert("Edit failed! Check backend.");
    }
  });

  // --------------------
  // Delete Task
  // --------------------
  delete_btn.addEventListener("click", async function () {
    try {
      const res = await fetch(`${API_URL}/${task_id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      list_item.remove();
      updateStats();
    } catch (error) {
      console.error("Delete error:", error);
    }
  });

  list_item.appendChild(complete_btn);
  list_item.appendChild(task_text);
  list_item.appendChild(edit_btn);
  list_item.appendChild(delete_btn);

  task_list.appendChild(list_item);
}

// --------------------
// Theme Toggle
// --------------------
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀" : "🌙";
});