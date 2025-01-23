function initializeTheme() {
  chrome.storage.sync.get(["theme"], (result) => {
    const theme = result.theme || "light";
    applyTheme(theme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const themeToggleIcon = document.querySelector(
    "#themeToggle .material-icons"
  );
  if (themeToggleIcon) {
    themeToggleIcon.textContent =
      theme === "light" ? "dark_mode" : "light_mode";
  }

  chrome.storage.sync.set({ theme: theme });
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);

  // Broadcast theme change to other extension pages
  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: "themeChanged", theme: newTheme });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});

if (chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "themeChanged") {
      applyTheme(message.theme);
    }
  });
}
