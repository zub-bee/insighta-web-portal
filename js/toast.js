import { escapeHtml } from "./utils.js";

let nextId = 0;
const DURATION = 4000;
const timers = new Map();

function getContainer() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast toast-top toast-center z-9999 max-w-sm";
    document.body.appendChild(container);
  }
  return container;
}

function alertClass(type) {
  switch (type) {
    case "success":
      return "alert-success";
    case "warning":
      return "alert-warning";
    case "error":
      return "alert-error";
    default:
      return "alert-soft";
  }
}

function removeToast(id) {
  const el = document.getElementById(`toast-${id}`);
  if (el) el.remove();
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
}

export function showToast(message, type = "info") {
  const container = getContainer();
  const id = ++nextId;

  // Keep max 5
  while (container.children.length >= 5) {
    const first = container.firstElementChild;
    if (first) {
      const oldId = parseInt(first.id.replace("toast-", ""));
      removeToast(oldId);
    }
  }

  const div = document.createElement("div");
  div.id = `toast-${id}`;
  div.className = `alert ${alertClass(type)} shadow-lg cursor-pointer text-sm`;
  div.innerHTML = `<span>${escapeHtml(message)}</span>`;
  div.addEventListener("click", () => removeToast(id));
  container.appendChild(div);

  const timer = setTimeout(() => removeToast(id), DURATION);
  timers.set(id, timer);
}
