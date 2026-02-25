const task_input = document.getElementById("inp");
const add_btn = document.getElementById("add-btn");
const task_list = document.getElementById("tasklist");

const totalSpan = document.getElementById("total");
const completedSpan = document.getElementById("completed");
const themeToggle = document.getElementById("theme-toggle");

// Backend API
const API_URL = "https://todo-application-backend-dvt7.onrender.com/todolist";

// --------------------
// Update Stats
// --------------------
function updateStats() {
  const tasks = task_list.querySelectorAll("li");
  const completedTasks = task_list.querySelectorAll(".completed");

  totalSpan.textContent = tasks.length;
  completedSpan.textContent = completedTasks.length;
}

// --------------------
// Load Tasks
// --------------------
window.addEventListener("DOMContentLoaded", function () {
  fetch(API_URL)
    .then((res) => res.json())
    .then((tasks) => {
      tasks.forEach((task) => {
        create_task_list(task._id, task.userTask, task.status);
      });
      updateStats();
    });
});

// --------------------
// Add Task
// --------------------
add_btn.addEventListener("click", function () {
  const input_task = task_input.value.trim();

  if (input_task === "") {
    alert("Please enter a task!");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userTask: input_task }),
  })
    .then((res) => res.json())
    .then((newtask) => {
      create_task_list(newtask._id, newtask.userTask, newtask.status);
      task_input.value = "";
      updateStats();
    });
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
  delete_btn.className = "delete-btn";
  delete_btn.textContent = "Delete";

  if (task_status) {
    task_text.classList.add("completed");
  }

  // --------------------
  // Complete Task
  // --------------------
  complete_btn.addEventListener("click", function () {
    let finished = task_text.classList.contains("completed");

    fetch(`${API_URL}/${task_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !finished }),
    }).then(() => {
      task_text.classList.toggle("completed");
      updateStats();
    });
  });

  // --------------------
  // Edit Task  ✅ FIXED
  // --------------------
  edit_btn.addEventListener("click", function () {
    const updatedText = prompt("Edit your task:", task_text.textContent);

    if (updatedText === null) return; // cancel pressed
    if (updatedText.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }

    fetch(`${API_URL}/${task_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: updatedText.trim() }),
    }).then(() => {
      task_text.textContent = updatedText.trim();
    });
  });

  // --------------------
  // Delete Task
  // --------------------
  delete_btn.addEventListener("click", function () {
    fetch(`${API_URL}/${task_id}`, {
      method: "DELETE",
    }).then(() => {
      task_list.removeChild(list_item);
      updateStats();
    });
  });

  // Append Elements
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