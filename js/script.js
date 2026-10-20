const toggleBtn = document.getElementById("theme-toggle");
const root = document.documentElement; // the <html> element

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

// Load the saved theme, or fall back to the system preference
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme ?? (systemPrefersDark ? "dark" : "light"));

// Toggle on click and remember the choice
toggleBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});