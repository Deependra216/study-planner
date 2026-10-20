import { tasks } from "./data.js"
import { groupByStatus, progressPercent } from "./utils.js";

const groups = groupByStatus(tasks);

document.querySelectorAll("#tasks article").forEach((column) => {
  const list = column.querySelector("ul");
  const items = groups[column.dataset.status] ?? [];

  // map: turn each task into an HTML string
  list.innerHTML = items
    .map(({ title, subject }) => `<li>${title} <small>${subject}</small></li>`)
    .join("");
});

document.querySelector("#progress progress").value = progressPercent(tasks);