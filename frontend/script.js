function updateStats() {
    const tasks = document.querySelectorAll("#taskList li");
    const completed = document.querySelectorAll(".completed");

    document.getElementById("total").textContent = tasks.length;
    document.getElementById("completed").textContent = completed.length;
}

function showMessage(text) {
    const msg = document.getElementById("message");
    msg.textContent = text;
    msg.classList.add("show");

    setTimeout(() => {
        msg.classList.remove("show");
    }, 2000);
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (text === "") return;

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onclick = function () {
        span.classList.toggle("completed");
        updateStats();

        if (checkbox.checked) {
            showMessage("Task completed!");
        }
    };

    const span = document.createElement("span");
    span.textContent = text;
    span.className = "task-text";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = function () {
        const newText = prompt("Edit task:", span.textContent);
        if (newText && newText.trim() !== "") {
            span.textContent = newText;
        }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function () {
        
        li.style.transition = "0.3s";
        li.style.opacity = "0";
        li.style.transform = "translateX(40px)";
        setTimeout(() => {
            li.remove();
            updateStats();
        }, 300);
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
    input.value = "";

    updateStats();
}
