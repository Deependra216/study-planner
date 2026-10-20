import { tasks as defaultTasks } from "./data.js";

const STORAGE_KEY = "tasks";
const STATUSES = ["todo", "doing", "done"];

// ---------- State ----------
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultTasks;
  } catch {
    return defaultTasks; // corrupted or blocked storage
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------- Rendering ----------
function createTaskItem(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  const title = document.createElement("span");
  title.textContent = task.title; // textContent is safe for user input

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const index = STATUSES.indexOf(task.status);

  const left = document.createElement("button");
  left.textContent = "◀";
  left.dataset.action = "left";
  left.setAttribute("aria-label", "Move left");
  left.disabled = index === 0;

  const right = document.createElement("button");
  right.textContent = "▶";
  right.dataset.action = "right";
  right.setAttribute("aria-label", "Move right");
  right.disabled = index === STATUSES.length - 1;

  const remove = document.createElement("button");
  remove.textContent = "✕";
  remove.dataset.action = "delete";
  remove.setAttribute("aria-label", "Delete task");

  actions.append(left, right, remove);
  li.append(title, actions);
  return li;
}

function updateProgress() {
  const done = tasks.filter((task) => task.status === "done").length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  document.querySelector("#progress progress").value = percent;
}

function render() {
  document.querySelectorAll("#tasks article").forEach((column) => {
    const list = column.querySelector("ul");
    list.innerHTML = ""; // clear, then rebuild
    tasks
      .filter((task) => task.status === column.dataset.status)
      .forEach((task) => list.appendChild(createTaskItem(task)));
  });
  updateProgress();
}

function update(newTasks) {
  tasks = newTasks;
  saveTasks();
  render();
}

// ---------- Add ----------
document.getElementById("task-form").addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const input = document.getElementById("task-input");
  const title = input.value.trim();
  if (!title) return;

  const newTask = { id: Date.now(), title, subject: "General", status: "todo", hours: 1 };
  update([...tasks, newTask]);
  input.value = "";
  input.focus();
});

// ---------- Move and delete (event delegation) ----------
document.getElementById("tasks").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.closest("li").dataset.id);
  const { action } = button.dataset;

  if (action === "delete") {
    update(tasks.filter((task) => task.id !== id));
    return;
  }

  const step = action === "right" ? 1 : -1;
  update(
    tasks.map((task) => {
      if (task.id !== id) return task;
      const next = STATUSES[STATUSES.indexOf(task.status) + step];
      return { ...task, status: next };
    })
  );
});

render();

// import { tasks } from "./data.js"
// import { groupByStatus, progressPercent } from "./utils.js";


// const groups = groupByStatus(tasks);

// document.querySelectorAll("#tasks article").forEach((column) => {
//   const list = column.querySelector("ul");
//   const items = groups[column.dataset.status] ?? [];

//   // map: turn each task into an HTML string
//   list.innerHTML = items
//     .map(({ title, subject }) => `<li>${title} <small>${subject}</small></li>`)
//     .join("");
// });

// document.querySelector("#progress progress").value = progressPercent(tasks);