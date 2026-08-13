/* ================= TASK DATA ================= */

let tasks = JSON.parse(localStorage.getItem("focusflowTasks")) || [

    {
        id: 1,
        name: "Complete DBMS assignment",
        category: "Study",
        priority: "high",
        completed: false
    },

    {
        id: 2,
        name: "Practice DSA problems",
        category: "Study",
        priority: "medium",
        completed: true
    },

    {
        id: 3,
        name: "Work on AI project",
        category: "Project",
        priority: "high",
        completed: false
    },

    {
        id: 4,
        name: "Review Java concepts",
        category: "Study",
        priority: "low",
        completed: false
    }

];


let currentFilter = "all";


/* ================= RENDER TASKS ================= */

function renderTasks() {

    const list = document.getElementById("taskList");

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    let filtered = tasks.filter(task => {

        const matchesSearch =
            task.name
                .toLowerCase()
                .includes(search);

        const matchesFilter =
            currentFilter === "all" ||
            task.priority === currentFilter;

        return matchesSearch && matchesFilter;

    });


    if (filtered.length === 0) {

        list.innerHTML = `
            <div style="
                text-align:center;
                padding:30px;
                color:#656c7d;
                font-size:11px;
            ">
                ✦ No tasks found
            </div>
        `;

        updateStats();

        return;
    }


    list.innerHTML = filtered.map(task => `

        <div class="task ${task.completed ? "completed" : ""}">

            <button
                class="task-check"
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "✓" : ""}
            </button>

            <div class="task-content">

                <span class="task-name">
                    ${escapeHTML(task.name)}
                </span>

                <div class="task-meta">

                    <span>
                        ${escapeHTML(task.category)}
                    </span>

                    <span class="priority ${task.priority}">
                        ${task.priority.toUpperCase()}
                    </span>

                </div>

            </div>

            <button
                class="delete-task"
                onclick="deleteTask(${task.id})"
            >
                ×
            </button>

        </div>

    `).join("");


    updateStats();
}


/* ================= ESCAPE HTML ================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================= ADD TASK ================= */

document
    .getElementById("taskForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("taskName")
                .value
                .trim();


        const category =
            document
                .getElementById("taskCategory")
                .value;


        const priority =
            document
                .getElementById("taskPriority")
                .value;


        if (!name) return;


        tasks.unshift({

            id: Date.now(),

            name: name,

            category: category,

            priority: priority,

            completed: false

        });


        saveTasks();

        renderTasks();

        closeTaskModal();

        this.reset();

    });


/* ================= COMPLETE TASK ================= */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();
}


/* ================= DELETE TASK ================= */

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


/* ================= SAVE ================= */

function saveTasks() {

    localStorage.setItem(
        "focusflowTasks",
        JSON.stringify(tasks)
    );

}


/* ================= FILTER ================= */

function filterTasks(filter, button) {

    currentFilter = filter;


    document
        .querySelectorAll(".filter")
        .forEach(btn => {
            btn.classList.remove("active");
        });


    button.classList.add("active");


    renderTasks();
}


/* ================= SEARCH ================= */

document
    .getElementById("searchInput")
    .addEventListener("input", renderTasks);


/* ================= STATS ================= */

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;


    document.getElementById("totalTasks").textContent =
        total - completed;


    document.getElementById("completedTasks").textContent =
        completed;


    document.getElementById("taskBadge").textContent =
        total - completed;
}


/* ================= MODAL ================= */

function openTaskModal() {

    document
        .getElementById("taskModal")
        .classList.add("show");


    document
        .getElementById("taskName")
        .focus();
}


function closeTaskModal() {

    document
        .getElementById("taskModal")
        .classList.remove("show");

}


document
    .getElementById("taskModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeTaskModal();

        }

    });


/* ================= TIMER ================= */

let timerMinutes = 25;

let timerSeconds = 0;

let timerInterval = null;

let timerRunning = false;


function updateTimerDisplay() {

    const minutes =
        String(timerMinutes).padStart(2, "0");

    const seconds =
        String(timerSeconds).padStart(2, "0");


    document.getElementById("timer").textContent =
        `${minutes}:${seconds}`;
}


function startTimer() {

    if (timerRunning) {

        clearInterval(timerInterval);

        timerRunning = false;

        document.getElementById("startBtn").innerHTML =
            "▶ Start";

        return;
    }


    timerRunning = true;

    document.getElementById("startBtn").innerHTML =
        "Ⅱ Pause";


    timerInterval = setInterval(() => {

        if (
            timerMinutes === 0 &&
            timerSeconds === 0
        ) {

            clearInterval(timerInterval);

            timerRunning = false;

            document.getElementById("startBtn").innerHTML =
                "▶ Start";

            alert("🎉 Focus session complete!");

            return;
        }


        if (timerSeconds === 0) {

            timerMinutes--;

            timerSeconds = 59;

        } else {

            timerSeconds--;

        }


        updateTimerDisplay();

    }, 1000);

}


function resetTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerMinutes = 25;

    timerSeconds = 0;

    document.getElementById("startBtn").innerHTML =
        "▶ Start";

    updateTimerDisplay();
}


function setTimer(minutes, button) {

    clearInterval(timerInterval);

    timerRunning = false;

    timerMinutes = minutes;

    timerSeconds = 0;

    updateTimerDisplay();


    document
        .querySelectorAll(".mode")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");

    document.getElementById("startBtn").innerHTML =
        "▶ Start";
}


/* ================= THEME ================= */

function toggleTheme() {

    document.body.classList.toggle("light-mode");

}


/* ================= INITIALIZE ================= */

renderTasks();

updateTimerDisplay();