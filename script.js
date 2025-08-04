// Write function for saveMood, using localStorage to store data from users input
function saveMood(mood) {
  // Create unique timestamp (date + time) to allow multiple entries
  const now = new Date();
  const timestamp = new Date().toLocaleString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const today = new Date().toLocaleDateString();
  let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

  const moodEntry = { date: timestamp, mood: mood }; // Add a new mood entry with full timestamp
  moodHistory.push(moodEntry);
  localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  displayMoods(); // Refresh list and chart
  fetchAdvice(); // Fetch advice after choosing mood buttons
}

// Write function for displayMood (moodHistory placeholder in html), display latest mood first in reverse order
function displayMoods() {
  const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const list = document.getElementById("mood-history");
  list.innerHTML = "";

  // Display latest mood first (reverse order)
  moodHistory
    .slice()
    .reverse()
    .forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.date}: ${entry.mood}`;
      list.appendChild(listItem);
    });

  updateChart(moodHistory);
}

// Write fetch function for fetchAdvice()
// Write functions for toggle button and clearHistory button (placed at Mood History Title)
function toggleHistory() {
  const container = document.getElementById("mood-history-container");
  const toggleBtn = document.getElementById("toggle-history");

  if (container.classList.contains("collapsed")) {
    container.classList.remove("collapsed");
    toggleBtn.textContent = "Hide";
  } else {
    container.classList.add("collapsed");
    toggleBtn.textContent = "Show";
  }
}
function clearMoodHistory() {
  const confirmClear = confirm(
    "Are you sure you want to clear all mood history?"
  );
  if (confirmClear) {
    localStorage.removeItem("moodHistory");
    displayMoods(); // Refresh the list and chart
  }
}
// Chart.js placeholder, consider visualize as line chart
// Load on page

window.onload = displayMoods;