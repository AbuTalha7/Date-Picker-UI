const monthLabel = document.getElementById("monthLabel");
const calendarBody = document.getElementById("calendarBody");
const selectedDateOutput = document.getElementById("selected-date");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");
const clearButton = document.getElementById("clearButton");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const shortFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const today = new Date();
let currentView = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today);
selectedDate.setHours(0, 0, 0, 0);

function formatMonthYear(date) {
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function createDate(year, month, day) {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function sameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatSelectedDate() {
  if (!selectedDate) {
    selectedDateOutput.textContent = "No date selected";
    return;
  }

  selectedDateOutput.textContent = dayFormatter.format(selectedDate);
}

function renderCalendar() {
  monthLabel.textContent = formatMonthYear(currentView);
  calendarBody.innerHTML = "";

  const year = currentView.getFullYear();
  const month = currentView.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();
  const totalCells = 42;

  let row = document.createElement("tr");

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - firstDayOfMonth + 1;
    let cellDate;
    let isOutsideMonth = false;

    if (dayNumber < 1) {
      cellDate = createDate(year, month - 1, daysInPreviousMonth + dayNumber);
      isOutsideMonth = true;
    } else if (dayNumber > daysInMonth) {
      cellDate = createDate(year, month + 1, dayNumber - daysInMonth);
      isOutsideMonth = true;
    } else {
      cellDate = createDate(year, month, dayNumber);
    }

    if (index % 7 === 0 && index !== 0) {
      calendarBody.appendChild(row);
      row = document.createElement("tr");
    }

    const cell = document.createElement("td");
    cell.className = "day-cell";

    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "day";
    dayButton.setAttribute("aria-label", dayFormatter.format(cellDate));
    dayButton.textContent = String(cellDate.getDate());

    if (isOutsideMonth) {
      dayButton.classList.add("day--outside");
    }

    if (sameDay(cellDate, today)) {
      dayButton.classList.add("day--today");
    }

    if (selectedDate && sameDay(cellDate, selectedDate)) {
      dayButton.classList.add("day--selected");
    }

    dayButton.addEventListener("click", () => {
      selectedDate = cellDate;
      currentView = new Date(cellDate.getFullYear(), cellDate.getMonth(), 1);
      formatSelectedDate();
      renderCalendar();
    });

    cell.appendChild(dayButton);
    row.appendChild(cell);
  }

  calendarBody.appendChild(row);
  formatSelectedDate();
}

prevMonthButton.addEventListener("click", () => {
  currentView = new Date(currentView.getFullYear(), currentView.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentView = new Date(currentView.getFullYear(), currentView.getMonth() + 1, 1);
  renderCalendar();
});

const jumpToToday = () => {
  currentView = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate = new Date(today);
  selectedDate.setHours(0, 0, 0, 0);
  renderCalendar();
};

todayButton.addEventListener("click", jumpToToday);

clearButton.addEventListener("click", () => {
  selectedDate = null;
  formatSelectedDate();
  renderCalendar();
});

renderCalendar();
