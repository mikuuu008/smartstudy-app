// ============================
// LOGIN / REGISTER / DASHBOARD JS
// ============================

// ============================
// REGISTER
// ============================
function registerUser() {
    let name = document.getElementById("name")?.value.trim();
    let course = document.getElementById("course")?.value.trim();
    let goal = document.getElementById("goal")?.value.trim();
    let gender = document.getElementById("gender")?.value;
    let username = document.getElementById("username")?.value.trim();
    let password = document.getElementById("password")?.value;

    if (!name || !course || !goal || !username || !password) {
        alert("Fill all fields");
        return;
    }

    if (isNaN(goal) || goal <= 0) {
        alert("Enter valid goal");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some(u => u.username === username)) {
        alert("Username already exists");
        return;
    }

    users.push({ name, course, goal: Number(goal), gender, username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    window.location.href = "index.html";
}


// ============================
// LOGIN
// ============================
function login() {
    let username = document.getElementById("username")?.value.trim();
    let password = document.getElementById("password")?.value;

    if (!username || !password) {
        alert("Enter both username and password");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    let user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid username or password");
        return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "dashboard.html";
}


// ============================
// AUTH CHECK
// ============================
function checkLogin() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "index.html";
    }
}


// ============================
// LOGOUT
// ============================
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    localStorage.setItem("logoutMsg", "You have logged out successfully");

    window.location.href = "index.html";
}


// ============================
// PROFILE
// ============================
function showProfile() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    let info = document.getElementById("profileInfo");
    let photo = document.getElementById("profilePhoto");

    if (info) {
        info.innerHTML = `
            <b>Name:</b> ${user.name}<br>
            <b>Course:</b> ${user.course}<br>
            <b>Daily Goal:</b> ${user.goal} hrs
        `;
    }

    if (photo) {
        photo.src = (user.gender === "female") ? "images/female.png" : "images/male.png";
    }
}


// ============================
// WELCOME MESSAGE
// ============================
function showWelcome() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let msg = document.getElementById("welcomeMsg");

    if (user && msg) {
        msg.innerText = `Welcome back, ${user.name} 👋`;
    }
}


// ============================
// STUDY RECORDS
// ============================
function addStudy() {
    let s = document.getElementById("subject")?.value;
    let h = parseFloat(document.getElementById("hours")?.value);

    if (!s || !h) {
        alert("Enter subject & hours");
        return;
    }

    let recs = JSON.parse(localStorage.getItem("records") || "[]");

    recs.push({
        subject: s,
        hours: h,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("records", JSON.stringify(recs));

    renderRecords();
    renderStudyChart();
    renderWeeklyChart();
    updateGoalProgress();
    updateProductivity();
}


function renderRecords() {
    let list = document.getElementById("records");
    if (!list) return;

    list.innerHTML = "";

    let recs = JSON.parse(localStorage.getItem("records") || "[]");

    recs.forEach(r => {
        let li = document.createElement("li");
        li.textContent = `${r.subject} - ${r.hours} hrs`;
        list.appendChild(li);
    });
}


// ============================
// HCI QUIZ
// ============================
function checkHCIAnswer() {
    let ans = document.getElementById("hciAnswer")?.value.toLowerCase();
    let res = document.getElementById("hciResult");

    if (!res) return;

    if (ans.includes("time") || ans.includes("distance") || ans.includes("target")) {
        res.innerHTML = "✅ Correct!";
        res.style.color = "green";
    } else {
        res.innerHTML = "❌ Try again";
        res.style.color = "red";
    }
}


// ============================
// POMODORO TIMER
// ============================
let timer;
let time = 1500;

function startPomodoro() {
    clearInterval(timer);

    timer = setInterval(() => {
        time--;

        let min = Math.floor(time / 60);
        let sec = time % 60;

        let display = document.getElementById("timer");
        if (display) {
            display.innerText = `${min}:${sec < 10 ? "0" : ""}${sec}`;
        }

        if (time <= 0) {
            clearInterval(timer);
            alert("Time's up! Take a break!");
        }

    }, 1000);
}

function stopPomodoro() {
    clearInterval(timer);
}

function resetPomodoro() {
    clearInterval(timer);
    time = 1500;

    let display = document.getElementById("timer");
    if (display) display.innerText = "25:00";
}


// ============================
// GOAL + PRODUCTIVITY
// ============================
function updateGoalProgress() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let goal = user ? user.goal : 6;

    let recs = JSON.parse(localStorage.getItem("records") || "[]");
    let total = recs.reduce((sum, r) => sum + r.hours, 0);

    let percent = Math.min(100, Math.round((total / goal) * 100));

    let bar = document.getElementById("goalProgress");

    if (bar) {
        bar.style.width = percent + "%";
        bar.innerText = percent + "%";
    }
}


function updateProductivity() {
    let recs = JSON.parse(localStorage.getItem("records") || "[]");

    let total = recs.reduce((sum, r) => sum + r.hours, 0);
    let score = Math.min(100, Math.round(total * 10));

    let box = document.getElementById("productivityScore");

    if (box) {
        box.innerText = `Productivity Score: ${score}%`;
    }
}

// ============================
// REAL TIME CLOCK + GREETING
// ============================
function startClock() {
    setInterval(() => {
        let now = new Date();

        let time = now.toLocaleTimeString();
        let hour = now.getHours();

        let greeting = "Hello";

        if (hour < 12) greeting = "Good Morning ☀️";
        else if (hour < 18) greeting = "Good Afternoon 🌤️";
        else greeting = "Good Evening 🌙";

        let user = JSON.parse(localStorage.getItem("currentUser"));

        let greetText = document.getElementById("greetingText");
        let clock = document.getElementById("clock");

        if (greetText && user) {
            greetText.innerText = `${greeting}, ${user.name} 👋`;
        }

        if (clock) {
            clock.innerText = time;
        }

    }, 1000);
}

// ============================
// CHARTS
// ============================
function renderStudyChart() {
    let c = document.getElementById("studyChart");
    if (!c || typeof Chart === "undefined") return;

    let recs = JSON.parse(localStorage.getItem("records") || "[]");

    let subj = {};
    recs.forEach(r => subj[r.subject] = (subj[r.subject] || 0) + r.hours);

    let labels = Object.keys(subj);
    let vals = Object.values(subj);

    if (labels.length === 0) {
        labels = ["No Data"];
        vals = [1];
    }

    if (window.studyChart) window.studyChart.destroy();

    window.studyChart = new Chart(c, {
        type: "pie",
        data: {
            labels,
            datasets: [{
                data: vals,
                backgroundColor: ["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6"]
            }]
        }
    });
}


function renderWeeklyChart() {
    let c = document.getElementById("weeklyChart");
    if (!c || typeof Chart === "undefined") return;

    let recs = JSON.parse(localStorage.getItem("records") || "[]");

    let days = {};
    recs.forEach(r => days[r.date] = (days[r.date] || 0) + r.hours);

    let labels = Object.keys(days);
    let vals = Object.values(days);

    if (window.weeklyChart) window.weeklyChart.destroy();

    window.weeklyChart = new Chart(c, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Study Hours",
                data: vals,
                borderColor: "#2563eb",
                fill: false
            }]
        }
    });
}


// ============================
// TASKS
// ============================
function addTask() {
    let input = document.getElementById("taskInput");
    let t = input?.value.trim();

    if (!t) {
        alert("Enter task");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    tasks.push(t);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    input.value = "";
    renderTasks();
}


function renderTasks() {
    let list = document.getElementById("taskList");
    if (!list) return;

    list.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    tasks.forEach((t, i) => {
        let li = document.createElement("li");
        li.textContent = t;

        let del = document.createElement("button");
        del.innerText = "❌";

        del.onclick = () => {
            tasks.splice(i, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        };

        li.appendChild(del);
        list.appendChild(li);
    });
}


// ============================
// DOM LOADED
// ============================
document.addEventListener("DOMContentLoaded", () => {

    // REGISTER BUTTON
    document.getElementById("registerBtn")?.addEventListener("click", registerUser);

    // LOGIN BUTTON
    document.getElementById("loginBtn")?.addEventListener("click", login);

    // LOGOUT MESSAGE
    let msg = localStorage.getItem("logoutMsg");
    if (msg) {
        alert(msg);
        localStorage.removeItem("logoutMsg");
    }

    // DASHBOARD ONLY
    if (window.location.pathname.includes("dashboard.html")) {

        checkLogin();
        showWelcome();
        showProfile();
        renderRecords();
        renderTasks();
        startClock();
        renderStudyChart();
        renderWeeklyChart();
        updateGoalProgress();
        updateProductivity();

        document.getElementById("addStudyBtn")?.addEventListener("click", addStudy);
        document.getElementById("hciSubmitBtn")?.addEventListener("click", checkHCIAnswer);
        document.getElementById("startTimer")?.addEventListener("click", startPomodoro);
        document.getElementById("stopTimer")?.addEventListener("click", stopPomodoro);
        document.getElementById("resetTimer")?.addEventListener("click", resetPomodoro);
        document.getElementById("addTaskBtn")?.addEventListener("click", addTask);
    }
});