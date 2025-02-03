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
  const startDay = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Create empty boxes for days before January 1st
  for (let i = 0; i < startDay; i++) {
    const emptyBox = document.createElement("div");
    emptyBox.className = "chart-day l0";
    chartContainer.appendChild(emptyBox);
  }

  // Create boxes for each day up to current day
  for (let day = 1; day <= days; day++) {
    const box = document.createElement("div");
    box.className = `chart-day l${getActivityLevel(day)}`;

    // Calculate the date for this box
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1);

    // Format the date for the tooltip
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    box.title = `${formattedDate}: ${day} push-ups`;
    chartContainer.appendChild(box);
  }

  // Fill remaining boxes for the year
  const totalCells = 53 * 7; // 53 weeks * 7 days
  const remainingCells = totalCells - (days + startDay);
  for (let i = 0; i < remainingCells; i++) {
    const futureBox = document.createElement("div");
    futureBox.className = "chart-day l0";
    chartContainer.appendChild(futureBox);
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
