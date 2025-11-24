// handle hamburger button - mobile menu
const hamburButton = document.querySelector(".hamburger-button");
const menu = document.querySelector(".dropdown-menu");
const overlay = document.getElementById("overlay");
const paginationContainer = document.querySelector(".pagination-container");

function toggleMenu() {
  menu.classList.toggle("active");
  overlay.classList.toggle("active");
}

hamburButton.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);
// handle hamburger button - mobile menu - END

const table = document.querySelector(".table");
const tbody = document.querySelector(".table tbody");

// get the current page from url
const params = new URLSearchParams(window.location.search);
const page = parseInt(params.get("page")) || 1;

// search
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", () => {
  searchLogs(searchInput.value);
});

window.addEventListener("DOMContentLoaded", () => loadLogs(page));

function makeRow(values) {
  const tr = document.createElement("tr");

  values.forEach((v, i) => {
    const td = document.createElement("td");
    td.textContent = v;

    // first column left aligned, rest right aligned
    td.style.textAlign = i === 0 ? "left" : "right";
    tr.appendChild(td);
  });

  return tr;
}

async function searchLogs(search) {
  try {
    const res = await fetch(`/api/logs?search=${search}`);
    const data = await res.json();

    // clear the table data
    tbody.innerHTML = "";

    // render new table data (search result)
    data.logs.forEach((log) => {
      const values = [log.deviceId, log.name, log.action, log.createdDate];
      tbody.appendChild(makeRow(values));
    });

    // render pagination
    renderPagination(data.totalPage, data.currentPage);
  } catch (e) {
    console.log("error fetching logs", e);
  }
}

async function fetchLogs(page = 1) {
  try {
    const res = await fetch(`/api/logs?page=${page}`);
    const logs = await res.json();
    return logs;
  } catch (e) {
    console.log("error fetching logs", e);
    return [];
  }
}

async function loadLogs(page) {
  const data = await fetchLogs(page); //logs, currentPage, totalPage

  data.logs.forEach((log) => {
    const values = [log.deviceId, log.name, log.action, log.createdDate];
    tbody.appendChild(makeRow(values));
  });

  // render pagination
  renderPagination(data.totalPage, data.currentPage);
}

function renderPagination(totalPage, currentPage) {
  paginationContainer.innerHTML = ""; // clear old buttons

  for (let i = 1; i <= totalPage; i++) {
    // create <a>
    const a = document.createElement("a");
    a.href = `/logs-screen/index.html?page=${i}`;

    // create button div
    const btn = document.createElement("div");
    btn.classList.add("pagination-button");

    // highlight the active page
    if (i === currentPage) {
      btn.classList.add("active");
    }

    // add text
    const p = document.createElement("p");
    p.classList.add("pagination-button-text");
    p.textContent = i;

    // assemble
    btn.appendChild(p);
    a.appendChild(btn);
    paginationContainer.appendChild(a);
  }
}
