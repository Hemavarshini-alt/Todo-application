const task_input = document.getElementById("inp");
const add_btn = document.getElementById("add-btn");
const task_list = document.getElementById("tasklist");

const totalSpan = document.getElementById("total");
const completedSpan = document.getElementById("completed");
const themeToggle = document.getElementById("theme-toggle");

const API_URL = "https://todo-application-2zba.onrender.com/todolist";

// function to update stats
function updateStats() {
  const tasks = task_list.querySelectorAll("li");
  const completedTasks = task_list.querySelectorAll(".completed");

  totalSpan.textContent = tasks.length;
  completedSpan.textContent = completedTasks.length;
}

// load tasks
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

// add task
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

function create_task_list(task_id, task_text_db, task_status) {
  const list_item = document.createElement("li");

  const complete_btn = document.createElement("button");
  complete_btn.textContent = "✔";

  const task_text = document.createElement("span");
  task_text.className = "task-text";
  task_text.textContent = task_text_db;

  const delete_btn = document.createElement("button");
  delete_btn.className = "delete-btn";
  delete_btn.textContent = "Delete";

  if (task_status) {
    task_text.classList.add("completed");
  }

  // complete task
  complete_btn.addEventListener("click", function () {
    let finished = task_text.classList.contains("completed");

    fetch(API_URL + "/" + task_id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !finished }),
    }).then(() => {
      task_text.classList.toggle("completed");
      updateStats();
    });
  });

  // delete task
  delete_btn.addEventListener("click", function () {
    fetch(API_URL + "/" + task_id, {
      method: "DELETE",
    }).then(() => {
      task_list.removeChild(list_item);
      updateStats();
    });
  });

  list_item.appendChild(complete_btn);
  list_item.appendChild(task_text);
  list_item.appendChild(delete_btn);

  task_list.appendChild(list_item);
}

/* Theme Toggle */
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀";
  } else {
    themeToggle.textContent = "🌙";
  }
});
