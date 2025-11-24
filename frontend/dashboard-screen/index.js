// handle hamburger button - mobile menu
const hamburButton = document.querySelector(".hamburger-button");
const menu = document.querySelector(".dropdown-menu");
const overlay = document.getElementById("overlay");

const deviceNameInput = document.getElementById("device-name-input");
const deviceIPInput = document.getElementById("device-ip-input");
const devicePowerInput = document.getElementById("device-power-input");

const deviceNameErrorMessage = document.getElementById("device-name-message");
const deviceIPErrorMessage = document.getElementById("device-ip-message");
const devicePowerErrorMessage = document.getElementById("device-power-message");

function toggleMenu() {
  menu.classList.toggle("active");
  overlay.classList.toggle("active");
}

hamburButton.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);
// handle hamburger button - mobile menu - END

const table = document.querySelector(".table");
const tbody = document.querySelector(".table tbody");
let totalConsumption = 0;
const totalRow = document.getElementById("totalConsumption").parentElement;
// For chart
const chartLabels = [];
const chartConsumptions = [];
// ---------------------
window.addEventListener("DOMContentLoaded", loadDevices);

// add device handler
const addDeviceForm = document.getElementById("add-device-form");
const buttonText = document.querySelector(".button-text");
const addDeviceButton = document.getElementById("add-device-button");

addDeviceForm.addEventListener("submit", function (e) {
  e.preventDefault(); // prevent page reload
  addDeviceButton.disabled = true;
  addDeviceButton.style.opacity = "0.6";
  addDeviceButton.style.cursor = "not-allowed";
  const newDevice = {
    name: deviceNameInput.value,
    IP: deviceIPInput.value,
    consumption: parseInt(devicePowerInput.value),
    createdDate: new Date().toISOString().split("T")[0], // yyyy-mm-dd
    MACAddress: generateRandomMAC(),
  };

  const loadingSpinner = document.querySelector(".loader");
  const buttonText = document.querySelector(".button-text");

  deviceNameInput.style.border = "none";
  deviceIPInput.style.border = "none";
  devicePowerInput.style.border = "none";

  deviceNameErrorMessage.style.display = "none";
  deviceIPErrorMessage.style.display = "none";
  devicePowerErrorMessage.style.display = "none";

  let isValid = true;

  if (newDevice.name.trim() === "") {
    isValid = false;
    // display validation error message
    deviceNameInput.style.border = "1px solid red";
    deviceNameErrorMessage.style.display = "block";
  }
  if (newDevice.IP.trim() === "") {
    isValid = false;
    // display validation error message
    deviceIPInput.style.border = "1px solid red";
    deviceIPErrorMessage.style.display = "block";
  }
  if (isNaN(newDevice.consumption)) {
    isValid = false;
    // display validation error message
    devicePowerInput.style.border = "1px solid red";
    devicePowerErrorMessage.style.display = "block";
  }
  if (isValid) {
    buttonText.style.display = "none";
    loadingSpinner.style.display = "block";
    setTimeout(async () => {
      // call api to add new device

      try {
        await fetch("/api/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDevice),
        });

        // success > reset form > update table
        deviceNameInput.value = "";
        deviceIPInput.value = "";
        devicePowerInput.value = "";

        buttonText.style.display = "block";
        loadingSpinner.style.display = "none";

        const values = [
          newDevice.name,
          newDevice.MACAddress,
          newDevice.IP,
          newDevice.createdDate,
          newDevice.consumption,
        ];

        tbody.insertBefore(makeRow(values), totalRow);

        document.getElementById("totalConsumption").textContent =
          totalConsumption += newDevice.consumption;
      } catch (error) {
        console.log("error adding new device: ", error);
      } finally {
        addDeviceButton.disabled = false;
        addDeviceButton.style.opacity = "1";
        addDeviceButton.style.cursor = "pointer";
      }
    }, 1000);
  } else {
    addDeviceButton.disabled = false;
    addDeviceButton.style.opacity = "1";
    addDeviceButton.style.cursor = "pointer";
  }
});

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

async function fetchDevices() {
  try {
    const res = await fetch("/api/devices");
    const devices = await res.json();
    return devices;
  } catch (e) {
    console.log("error fetching devices", e);
    return [];
  }
}

async function loadDevices() {
  const devices = await fetchDevices();

  devices.forEach((device) => {
    totalConsumption += device.consumption;

    chartLabels.push(device.name);
    chartConsumptions.push(device.consumption);

    const values = [
      device.name,
      device.MACAddress,
      device.IP,
      device.createdDate,
      device.consumption,
    ];

    tbody.insertBefore(makeRow(values), totalRow);
  });

  document.getElementById("totalConsumption").textContent = totalConsumption;

  // Chart rendering
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Device Consumption (Kw/H)",
          data: chartConsumptions,
          borderWidth: 1,
        },
      ],
    },
    options: {},
  });
}

function generateRandomMAC() {
  return "XX:XX:XX:XX:XX".replace(/X/g, () =>
    Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase()
  );
}
