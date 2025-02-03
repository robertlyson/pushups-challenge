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

// Calculate push-ups based on day of the year
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
}

// Calculate current year for footer
function updateFooterYear() {
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
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
});
