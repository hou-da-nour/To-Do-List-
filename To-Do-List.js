// document.addEventListener("DOMContentLoaded", loadTasks);

// const taskInputs = document.querySelectorAll("#taskInput"); // Select all input fields
// const addButtons = document.querySelectorAll("#addButton"); // Select all add buttons
// const taskLists = document.querySelectorAll(".task-list"); // Select all task lists

// // Attach event listeners to each add button
// addButtons.forEach((button, index) => {
//     button.addEventListener("click", () => addTask(index)); // Pass the index
// });

// function addTask(dayIndex) {
//     const taskInput = taskInputs[dayIndex]; // Get the correct input for the day
//     const taskList = taskLists[dayIndex]; // Get the correct task list

//     if (taskInput.value.trim() === "") return; // Ignore empty input

//     const li = document.createElement("li");
//     li.textContent = taskInput.value;

//     // ✅ Complete Button
//     const completeBtn = document.createElement("button");
//     completeBtn.textContent = "✅";
//     completeBtn.addEventListener("click", function () {
//         li.classList.toggle("completed");
//         saveTasks();
//     });

//     // ❌ Delete Button
//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "❌";
//     deleteBtn.addEventListener("click", function () {
//         li.remove();
//         saveTasks();
//     });

//     li.appendChild(completeBtn);
//     li.appendChild(deleteBtn);
//     taskList.appendChild(li);

//     saveTasks(); // Save to localStorage
//     taskInput.value = ""; // Clear input field
// }

// // Save tasks to localStorage (for all 7 days)
// function saveTasks() {
//     const tasksByDay = [];

//     taskLists.forEach(taskList => {
//         const tasks = [];
//         taskList.querySelectorAll("li").forEach(li => {
//             tasks.push({
//                 text: li.childNodes[0].nodeValue.trim(),
//                 completed: li.classList.contains("completed"),
//             });
//         });
//         tasksByDay.push(tasks);
//     });

//     localStorage.setItem("tasksByDay", JSON.stringify(tasksByDay));
// }

// // Load tasks from localStorage
// function loadTasks() {
//     const savedTasksByDay = JSON.parse(localStorage.getItem("tasksByDay")) || [];

//     taskLists.forEach((taskList, dayIndex) => {
//         taskList.innerHTML = ""; // Clear old tasks

//         const savedTasks = savedTasksByDay[dayIndex] || [];
//         savedTasks.forEach(task => {
//             const li = document.createElement("li");
//             li.textContent = task.text;

//             if (task.completed) li.classList.add("completed");

//             const completeBtn = document.createElement("button");
//             completeBtn.textContent = "✅";
//             completeBtn.addEventListener("click", function () {
//                 li.classList.toggle("completed");
//                 saveTasks();
//             });

//             const deleteBtn = document.createElement("button");
//             deleteBtn.textContent = "❌";
//             deleteBtn.addEventListener("click", function () {
//                 li.remove();
//                 saveTasks();
//             });

//             li.appendChild(completeBtn);
//             li.appendChild(deleteBtn);
//             taskList.appendChild(li);
//         });
//     });
// }
document.addEventListener("DOMContentLoaded", () => {
    const selectionScreen = document.querySelector("#Selection-Screen");
    const todoApp = document.querySelector("#todoApp");
    // const modeTitle = document.querySelector("#modeTitle");

    const modeButtons = document.querySelectorAll(".modeButton");

    const dailyList = document.querySelector("#dailyList");
    const weeklyList = document.querySelector("#weeklyList");
    const monthlyList = document.querySelector("#monthlyList");
    // for save the Date
    const dateInputs = document.querySelectorAll("#date");

    dateInputs.forEach((dateInput, index) => {
        // Load saved date from localStorage
        const savedDate = localStorage.getItem(`savedDate${index}`);
        if (savedDate) {
            dateInput.value = savedDate;
        }

        // Save date when user selects one
        dateInput.addEventListener("change", function () {
            localStorage.setItem(`savedDate${index}`, dateInput.value);
        });
    });

    // Show the selection screen on refresh
    selectionScreen.style.display = "block";
    todoApp.style.display = "none";

    modeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const selectedMode = this.dataset.mode;
            localStorage.setItem("selectedMode", selectedMode);
            loadMode(selectedMode);
        });
    });

    function loadMode(mode) {
        selectionScreen.style.display = "none";
        todoApp.style.display = "block";

        // modeTitle.textContent = `Your ${mode.charAt(0).toUpperCase() + mode.slice(1)} To-Do List`;

        dailyList.style.display = mode === "daily" ? "block" : "none";
        weeklyList.style.display = mode === "weekly" ? "block" : "none";
        monthlyList.style.display = mode === "monthly" ? "block" : "none";

        if (mode === "daily") setupDailyTasks();
        if (mode === "weekly") setupWeeklyTasks();
        if (mode === "monthly") setupMonthlyTasks();
    }

    // Daily Planner
    function setupDailyTasks() {
        const input = document.querySelector("#dailyInput");
        const button = document.querySelector("#weeklyAdd");
        const taskList = document.querySelector("#dailyTasks");

        loadTasks("daily", taskList);

        button.addEventListener("click", function () {
            addTask("daily", input, taskList);
        });
    }

    // Weekly Planner
    function setupWeeklyTasks() {
        document.querySelectorAll(".day").forEach(day => {
            const dayId = day.id;
            const input = day.querySelector("input");
            const button = day.querySelector("button");
            const taskList = day.querySelector(".task-list");

            loadTasks(dayId, taskList);

            button.addEventListener("click", function () {
                addTask(dayId, input, taskList);
            });
        });
    }

    // Monthly Planner
    function setupMonthlyTasks() {
        document.querySelectorAll(".month").forEach(month => {
            const monthId = month.id;
            const input = month.querySelector("input");
            const button = month.querySelector("button");
            const taskList = month.querySelector(".task-list-month");

            loadTasks(monthId, taskList);

            button.addEventListener("click", function () {
                addTask(monthId, input, taskList);
            });
        });
    }


    function addTask(mode, input, list) {
        if (input.value.trim() === "") return;

        const li = document.createElement("li");
        li.textContent = input.value;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✅";
        completeBtn.addEventListener("click", function () {
            li.classList.toggle("completed");
            saveTasks(mode, list);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", function () {
            li.remove();
            saveTasks(mode, list);
        });

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);

        saveTasks(mode, list);
        input.value = "";
    }

    function saveTasks(mode, list) {
        const tasks = [];
        list.querySelectorAll("li").forEach(li => {
            tasks.push({
                text: li.childNodes[0].nodeValue.trim(),
                completed: li.classList.contains("completed"),
            });
        });
        localStorage.setItem(`tasks_${mode}`, JSON.stringify(tasks));
    }

    function loadTasks(mode, list) {
        list.innerHTML = "";
        const savedTasks = JSON.parse(localStorage.getItem(`tasks_${mode}`)) || [];

        savedTasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task.text;
            if (task.completed) li.classList.add("completed");

            const completeBtn = document.createElement("button");
            completeBtn.textContent = "✅";
            completeBtn.addEventListener("click", function () {
                li.classList.toggle("completed");
                saveTasks(mode, list);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.addEventListener("click", function () {
                li.remove();
                saveTasks(mode, list);
            });

            li.appendChild(completeBtn);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    }
    const goBackButton = document.querySelectorAll(".go-back");
        // Cacher tous les boutons "Go Back" au début
        goBackButton.forEach(button => button.style.display = "none");

        // Quand un mode est sélectionné, afficher "Go Back"
        modeButtons.forEach(button => {
            button.addEventListener("click", () => {
                selectionScreen.style.display = "none";
                todoApp.style.display = "block";
                goBackButton.forEach(btn => btn.style.display = "block"); // Afficher tous les boutons "Go Back"
            });
        });

        // Ajouter un event listener à chaque bouton "Go Back"
        goBackButton.forEach(button => {
            button.addEventListener("click", () => {
                selectionScreen.style.display = "block";
                todoApp.style.display = "none";
                goBackButton.forEach(btn => btn.style.display = "none"); // Cacher tous les boutons
            });
        });
});


