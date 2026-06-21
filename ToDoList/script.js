// =========================
// TaskFlow Pro - script.js
// =========================

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterTasks = document.getElementById("filterTasks");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const emptyState = document.getElementById("emptyState");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// =========================
// Save to Local Storage
// =========================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =========================
// Update Dashboard Stats
// =========================

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    progressPercent.textContent = percentage + "%";
    progressFill.style.width = percentage + "%";
}

// =========================
// Render Tasks
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterTasks.value;

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(searchValue);

        const matchesFilter =
            filterValue === "all" ||
            (filterValue === "completed" && task.completed) ||
            (filterValue === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className =
            task.completed
                ? "task-item completed"
                : "task-item";

        const priorityClass =
            task.priority.toLowerCase();

        li.innerHTML = `
            <div class="task-left">

                <div class="task-title">
                    ${task.text}
                </div>

                <div class="task-meta">
                    Due: ${task.dueDate || "No Date"}
                </div>

                <div style="margin-top:10px;">
                    <span class="priority ${priorityClass}">
                        ${task.priority}
                    </span>
                </div>

            </div>

            <div class="actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">

                    <i class="fa-solid fa-check"></i>

                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

// =========================
// Add Task
// =========================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        dueDate: dueDate.value,
        priority: priority.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    dueDate.value = "";
    priority.value = "High";
}

addTaskBtn.addEventListener("click", addTask);

// =========================
// Complete Task
// =========================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// =========================
// Delete Task
// =========================

function deleteTask(id) {

    const confirmDelete =
        confirm("Delete this task?");

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

// =========================
// Edit Task
// =========================

function editTask(id) {

    const task =
        tasks.find(t => t.id === id);

    const updatedText = prompt(
        "Edit task:",
        task.text
    );

    if (
        updatedText === null ||
        updatedText.trim() === ""
    ) {
        return;
    }

    task.text = updatedText.trim();

    saveTasks();
    renderTasks();
}

// =========================
// Search Tasks
// =========================

searchInput.addEventListener(
    "keyup",
    renderTasks
);

// =========================
// Filter Tasks
// =========================

filterTasks.addEventListener(
    "change",
    renderTasks
);

// =========================
// Initial Render
// =========================

renderTasks();