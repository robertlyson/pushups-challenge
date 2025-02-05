// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    section.scrollIntoView({ behavior: "smooth" });
  });
});

function getActivityLevel(pushups) {
  if (pushups === 0) return 0;
  if (pushups <= 30) return 1;
  if (pushups <= 100) return 2;
  if (pushups <= 200) return 3;
  return 4;
}

function createActivityChart(days) {
  const chartContainer = document.getElementById("activityChart");
  if (!chartContainer) return;

  // Clear existing chart
  chartContainer.innerHTML = "";

  const startDate = new Date(new Date().getFullYear(), 0, 1);
  // Adjust startDay to handle Monday as first day (0 = Monday, 6 = Sunday)
  let startDay = startDate.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1; // Convert Sunday (0) to 6, and shift others back by 1

  // Create empty boxes for days before January 1st
  for (let i = 0; i < startDay; i++) {
    const emptyBox = document.createElement("div");
    emptyBox.className = "chart-day l0";
    chartContainer.appendChild(emptyBox);
  }

  // Calculate total cells needed (52 weeks × 7 days)
  const totalCells = 52 * 7;

  // Create boxes for each cell
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startDay + 1; // Adjust for start day offset
    const box = document.createElement("div");

    // Calculate position in the grid (adjusted for Monday start)
    const weekNumber = Math.floor(i / 7);
    const dayOfWeek = i % 7;

    // Set the grid position
    box.style.gridArea = `${dayOfWeek + 1} / ${weekNumber + 1}`;

    // If this is a past/current day within our range
    if (dayNumber > 0 && dayNumber <= days) {
      const level = getActivityLevel(dayNumber);
      box.className = `chart-day l${level}`;

      // Calculate the date for this box
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayNumber - 1);

      // Format the date for the tooltip
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      box.title = `${formattedDate}: ${dayNumber} push-ups`;
    } else {
      // Empty cell
      box.className = "chart-day l0";
    }

    chartContainer.appendChild(box);
  }
}

// Add this function to calculate yearly totals
function updateMotivationStats(currentDay) {
  const daysInYear = 365;
  const yearlyTotal = (daysInYear * (daysInYear + 1)) / 2;
  const completedTotal = (currentDay * (currentDay + 1)) / 2;
  const remaining = yearlyTotal - completedTotal;

  // Format numbers with commas
  const formatNumber = (num) => num.toLocaleString();

  // Update the stats
  const completedElement = document.getElementById("completedPushUps");
  const yearlyElement = document.getElementById("yearlyTotal");
  const remainingElement = document.getElementById("remainingPushUps");

  if (completedElement) {
    completedElement.textContent = formatNumber(completedTotal);
  }
  if (yearlyElement) {
    yearlyElement.textContent = formatNumber(yearlyTotal);
  }
  if (remainingElement) {
    remainingElement.textContent = formatNumber(remaining);
  }
}

// Update the calculatePushUps function to include motivation stats
function calculatePushUps() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Calculate total push-ups (sum of all days from 1 to dayOfYear)
  let totalPushUps = 0;
  for (let day = 1; day <= dayOfYear; day++) {
    totalPushUps += day;
  }

  // Update push-up count for today
  const pushUpDisplay = document.getElementById("pushUpCount");
  if (pushUpDisplay) {
    pushUpDisplay.textContent = dayOfYear;
  }

  // Update total push-ups (sum of all days)
  const totalDisplay = document.getElementById("totalPushUps");
  if (totalDisplay) {
    totalDisplay.textContent = totalPushUps;
  }

  // Update current date
  const dateDisplay = document.getElementById("currentDate");
  if (dateDisplay) {
    dateDisplay.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Create activity chart
  createActivityChart(dayOfYear);

  // Update motivation stats
  updateMotivationStats(dayOfYear);
}

// Calculate current year for footer
function updateFooterYear() {
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Confetti animation function
function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 1000,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

// Handle done button click
function handleDoneButtonClick() {
  const button = document.getElementById("doneButton");
  const today = new Date();

  // Get the last completion date from localStorage
  const lastCompletionDate = localStorage.getItem("lastCompletionDate");
  const today_str = today.toDateString();

  if (lastCompletionDate === today_str) {
    return; // Already completed today
  }

  // Trigger confetti
  triggerConfetti();

  // Save completion date
  localStorage.setItem("lastCompletionDate", today_str);

  // Disable button for today
  button.classList.add("disabled");
  button.textContent = "Completed Today! 🎯";
}

// Initialize done button state
function initializeDoneButton() {
  const button = document.getElementById("doneButton");
  if (!button) return;

  const lastCompletionDate = localStorage.getItem("lastCompletionDate");
  const today_str = new Date().toDateString();

  if (lastCompletionDate === today_str) {
    button.classList.add("disabled");
    button.textContent = "Completed Today! 🎯";
  } else {
    button.classList.remove("disabled");
    button.textContent = "Done for Today! 🎉";
  }

  button.addEventListener("click", handleDoneButtonClick);
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Existing page load animation
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = "opacity 1s";
    document.body.style.opacity = 1;
  }, 100);

  // Calculate push-ups
  calculatePushUps();

  // Update footer year
  updateFooterYear();

  // Initialize done button
  initializeDoneButton();
});
