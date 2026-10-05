
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const clearBtn = document.getElementById("clearBtn");


// Add new task
function addTask() {

    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    let newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    showTasks();
}


// Display tasks
function showTasks() {

    taskList.innerHTML = "";

    let searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task) {

        let matchesSearch = task.text.toLowerCase().includes(searchText);

        if (currentFilter === "active") {
            return !task.completed && matchesSearch;
        }

        if (currentFilter === "completed") {
            return task.completed && matchesSearch;
        }

        return matchesSearch;
    });


    filteredTasks.forEach(function(task) {

        let li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <button class="check-btn" onclick="toggleTask(${task.id})">
                ${task.completed ? "✓" : ""}
            </button>

            <span class="task-text">${task.text}</span>

            <button class="delete-btn" onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });

    updateTaskCount();

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}


// Complete / uncomplete task
function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    showTasks();
}


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    showTasks();
}


// Update task counter
function updateTaskCount() {

    let activeTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    if (activeTasks === 1) {
        taskCount.textContent = "1 task left";
    } else {
        taskCount.textContent = activeTasks + " tasks left";
    }
}


// Clear completed tasks
clearBtn.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    showTasks();
});


// Filter buttons
document.querySelectorAll(".filter").forEach(function(button) {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter").forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.getAttribute("data-filter");

        showTasks();
    });
});


// Search tasks
searchInput.addEventListener("input", function() {
    showTasks();
});


// Add task using button
addBtn.addEventListener("click", addTask);


// Add task by pressing Enter
taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }
});


// Save tasks in browser
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Show tasks when page loads
showTasks();

