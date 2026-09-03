const fileTasks = Array.isArray(window.initialTasks) ? window.initialTasks : [];
let tasks = [...fileTasks];

const list = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");

const today = new Date();
today.setHours(0, 0, 0, 0);
document.querySelector("#todayLabel").textContent = formatDate(today, { day: "numeric", month: "long" });

function toISODate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function formatDate(dateString, options = { day: "numeric", month: "short" }) {
  const date = dateString instanceof Date ? dateString : new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("ru-RU", options).format(date);
}

function render() {
  const visible = tasks;
  list.innerHTML = visible.map((task) => {
    const overdue = !task.done && new Date(`${task.dueDate}T00:00:00`) < today;
    return `<article class="task ${task.done ? "completed" : ""}">
      <button class="task-toggle" type="button" aria-label="Открыть подробности" aria-expanded="false"></button>
      <div class="task-info">
        <p class="task-title" title="${escapeHtml(task.title)}">${escapeHtml(task.title)}</p>
        <div class="task-meta"><span class="subject-tag">${escapeHtml(task.subject)}</span></div>
      </div>
      <div class="task-date ${overdue ? "overdue" : ""}">${overdue ? "Просрочено" : formatDate(task.dueDate)}</div>
      <div class="task-details">
        <div><strong>Предмет</strong><span>${escapeHtml(task.subject)}</span></div>
        <div><strong>Задание</strong><span>${escapeHtml(task.title)}</span></div>
        <div><strong>Сдать до</strong><span>${formatDate(task.dueDate, { day: "numeric", month: "long", year: "numeric" })}</span></div>
        <div><strong>Заметка</strong><span>${task.note ? escapeHtml(task.note) : "Нет заметки"}</span></div>
      </div>
    </article>`;
  }).join("");
  emptyState.style.display = visible.length ? "none" : "block";
  document.querySelector("#taskCount").textContent = tasks.filter((task) => !task.done).length;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]);
}

list.addEventListener("click", (event) => {
  const toggle = event.target.closest(".task-toggle");
  if (!toggle) return;
  const task = toggle.closest(".task");
  const expanded = task.classList.toggle("expanded");
  toggle.setAttribute("aria-expanded", expanded);
});

render();