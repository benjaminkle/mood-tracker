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
function fetchAdvice() {
  const adviceBox = document.getElementById("advice-box");
  adviceBox.innerHTML = `<p><i>Loading quote...</i></p>`;

  fetch("https://api.realinspire.live/v1/quotes/random")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        const quote = data[0].content;
        const author = data[0].author || "Unknown";
        adviceBox.innerHTML = `<p>"${quote}"<br><i>- ${author}</i></p>`;
      } else {
        adviceBox.innerHTML = `<p><i>No quote found.</i></p>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      adviceBox.innerHTML = `<p><i>Could not fetch quote. Try again later.</i></p>`;
    });
}

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
let moodChart;

function updateChart(moodHistory) {
  const moodDates = moodHistory.map((entry) => entry.date);
  const moodValues = moodHistory.map((entry) => {
    if (entry.mood.includes("Happy")) return 3;
    if (entry.mood.includes("Neutral")) return 2;
    if (entry.mood.includes("Sad")) return 1;
  });

  const ctx = document.getElementById("moodChart").getContext("2d");
  if (moodChart) moodChart.destroy(); // Prevent duplicate charts

  moodChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: moodDates,
      datasets: [
        {
          label: "Mood Trend",
          data: moodValues,
          fill: false,
          borderColor: "#42a5f5",
          borderWidth: 3, // thicker solid line
          tension: 0.4, // curved line
          pointBackgroundColor: "#42a5f5",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: 4,
          ticks: {
            stepSize: 1,
            font: {
              size: 14, //controls the Y-axis labels size (Happy, Neutral, Sad)
            },
            callback: function (value) {
              if (value === 3) return "😊 Happy";
              if (value === 2) return "😐 Neutral";
              if (value === 1) return "😢 Sad";
              return "";
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            pointStyle: "line",
            boxWidth: 60,
            boxHeight: 10,
            padding: 16,
            font: {
              size: 15, //controls the legend "Mood Trend" size
            },
          },
        },
      },
    },
  });
}

// Load on page

window.onload = displayMoods;