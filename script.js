const listcontainer = document.getElementById("list-container");
const inputbox = document.getElementById("input-box");
const fontSelect = document.getElementById("font-select");
const clearBtn = document.getElementById("clear-btn");

// Persisted keys
const STORAGE_KEY = "todo_items_v1";
const FONT_KEY = "todo_font_v1";

function renderTasks() {
  listcontainer.innerHTML = "";
  const items = loadTasks();
  items.forEach((it, idx) => {
    const li = document.createElement("li");
    li.textContent = it.text;
    if (it.done) li.classList.add("checked");

    const span = document.createElement("span");
    span.innerHTML = "\u00d7"; // delete icon
    span.setAttribute("role", "button");
    span.setAttribute("aria-label", "delete task");
    span.tabIndex = 0;
    span.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTask(idx);
    });

    li.addEventListener("click", () => toggleTask(idx));
    li.appendChild(span);
    listcontainer.appendChild(li);
  });
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTasks(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addTask() {
  const value = inputbox.value.trim();
  if (!value) {
    alert("Enter Some Data");
    return;
  }
  const items = loadTasks();
  items.push({ text: value, done: false });
  saveTasks(items);
  inputbox.value = "";
  renderTasks();
}

function toggleTask(index) {
  const items = loadTasks();
  if (!items[index]) return;
  items[index].done = !items[index].done;
  saveTasks(items);
  renderTasks();
}

function removeTask(index) {
  const items = loadTasks();
  items.splice(index, 1);
  saveTasks(items);
  renderTasks();
}

function clearAll() {
  if (!confirm("Clear all tasks?")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderTasks();
}

/* Font persistence */
function applySavedFont() {
  const f = localStorage.getItem(FONT_KEY);
  if (f) {
    document.documentElement.style.setProperty("--app-font", f);
    if (fontSelect) fontSelect.value = f;
  }
}

function onFontChange(e) {
  const val = e.target.value;
  document.documentElement.style.setProperty("--app-font", val);
  localStorage.setItem(FONT_KEY, val);
}

/* Enter key: add task */
inputbox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

if (clearBtn) clearBtn.addEventListener("click", clearAll);
if (fontSelect) fontSelect.addEventListener("change", onFontChange);

// on load
applySavedFont();
renderTasks();
