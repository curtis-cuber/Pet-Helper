function applyDarkMode(dark) {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('darkMode', dark ? '1' : '0');
  const icon = document.getElementById('dark-mode-icon');
  if (icon) icon.textContent = dark ? '☀' : '☾';
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.contains('dark');
  applyDarkMode(!isDark);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('darkMode') === '1';
  applyDarkMode(saved);
});
