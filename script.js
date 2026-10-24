```javascript
/* =========================================
   STUDY HUB — JAVASCRIPT
   Interactive Student Dashboard
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. LIVE CLOCK & DATE
    // =====================================

    function updateClock() {
        const now = new Date();

        const time = now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        const date = now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const clockElement = document.getElementById("live-clock");
        const dateElement = document.getElementById("live-date");

        if (clockElement) clockElement.textContent = time;
        if (dateElement) dateElement.textContent = date;
    }

    updateClock();
    setInterval(updateClock, 1000);


    // =====================================
    // 2. GREETING BASED ON TIME
    // =====================================

    function updateGreeting() {
        const hour = new Date().getHours();
        let greeting = "Good evening";

        if (hour >= 4 && hour < 11) {
            greeting = "Good morning";
        } else if (hour >= 11 && hour < 15) {
            greeting = "Good afternoon";
        } else if (hour >= 15 && hour < 18) {
            greeting = "Good afternoon";
        }

        const greetingElement = document.getElementById("greeting");

        if (greetingElement) {
            greetingElement.textContent = greeting;
        }
    }

    updateGreeting();


    // =====================================
    // 3. DARK MODE
    // =====================================

    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("studyhub-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "studyhub-theme",
                isDark ? "dark" : "light"
            );

            themeToggle.textContent = isDark ? "☀️" : "🌙";
        });

        themeToggle.textContent =
            document.body.classList.contains("dark-mode")
                ? "☀️"
                : "🌙";
    }


    // =====================================
    // 4. TO-DO LIST
    // =====================================

    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const taskCount = document.getElementById("task-count");

    let tasks = JSON.parse(
        localStorage.getItem("studyhub-tasks") || "[]"
    );

    function saveTasks() {
        localStorage.setItem(
            "studyhub-tasks",
            JSON.stringify(tasks)
        );
    }

    function renderTasks() {
        if (!taskList) return;

        taskList.replaceChildren();

        tasks.forEach((task, index) => {
            const item = document.createElement("li");
            item.className = "task-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                "aria-label",
                "Mark task as completed"
            );

            checkbox.addEventListener("change", () => {
                tasks[index].completed = checkbox.checked;
                saveTasks();
                renderTasks();
                updateProgress();
            });

            const taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.textContent = task.text;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.textContent = "×";
            deleteButton.setAttribute("aria-label", "Delete task");

            deleteButton.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                updateProgress();
            });

            item.append(checkbox, taskText, deleteButton);
            taskList.appendChild(item);
        });

        if (taskCount) {
            const completed = tasks.filter(
                task => task.completed
            ).length;

            taskCount.textContent =
                `${completed}/${tasks.length} completed`;
        }
    }

    function addTask() {
        if (!taskInput) return;

        const text = taskInput.value.trim();

        if (!text) {
            taskInput.focus();
            return;
        }

        tasks.push({
            text: text,
            completed: false
        });

        saveTasks();
        renderTasks();
        updateProgress();

        taskInput.value = "";
        taskInput.focus();
    }

    if (addTaskButton) {
        addTaskButton.addEventListener("click", addTask);
    }

    if (taskInput) {
        taskInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                addTask();
            }
        });
    }

    renderTasks();


    // =====================================
    // 5. STUDY PROGRESS
    // =====================================

    function updateProgress() {
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");

        if (!progressBar && !progressText) return;

        const total = tasks.length;
        const completed = tasks.filter(
            task => task.completed
        ).length;

        const percentage = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute(
                "aria-valuenow",
                percentage
            );
        }

        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    }

    updateProgress();


    // =====================================
    // 6. SEARCH
    // =====================================

    const searchInput = document.getElementById("search-input");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value
                .toLowerCase()
                .trim();

            const searchableElements = document.querySelectorAll(
                "[data-searchable]"
            );

            searchableElements.forEach(element => {
                const content = element.textContent.toLowerCase();

                element.hidden = !content.includes(query);
            });
        });
    }


    // =====================================
    // 7. NOTES WITH AUTO-SAVE
    // =====================================

    const notesInput = document.getElementById("notes-input");
    const notesStatus = document.getElementById("notes-status");

    if (notesInput) {
        notesInput.value =
            localStorage.getItem("studyhub-notes") || "";

        let notesTimer;

        notesInput.addEventListener("input", () => {
            if (notesStatus) {
                notesStatus.textContent = "Saving...";
            }

            clearTimeout(notesTimer);

            notesTimer = setTimeout(() => {
                localStorage.setItem(
                    "studyhub-notes",
                    notesInput.value
                );

                if (notesStatus) {
                    notesStatus.textContent = "All changes saved ✓";
                }
            }, 400);
        });
    }


    // =====================================
    // 8. CURRENT YEAR
    // =====================================

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // =====================================
    // 9. MOBILE SIDEBAR
    // =====================================

    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar-open");
        });

        document.addEventListener("click", event => {
            const clickedInsideSidebar =
                sidebar.contains(event.target);

            const clickedMenu =
                menuToggle.contains(event.target);

            if (!clickedInsideSidebar && !clickedMenu) {
                sidebar.classList.remove("sidebar-open");
            }
        });
    }


    // =====================================
    // 10. BACK TO TOP
    // =====================================

    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // =====================================
    // 11. WELCOME CONSOLE MESSAGE
    // =====================================

    console.log(
        "%c Welcome to Study Hub! 📚",
        "font-size: 18px; font-weight: bold; color: #7c6ee6;"
    );

});
```

