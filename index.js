// Weather Forecast Functionality
// Self-learned from outside sources as mentioned in the project

const API_KEY = "af6a2c2d2c35980b050009439dc5a915"; // OpenWeatherMap API key

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const geoBtn = document.getElementById("geo-btn");
const unitToggle = document.getElementById("unit-toggle");
const messageArea = document.getElementById("message-area");
const currentCard = document.getElementById("current-card");
const forecastGrid = document.getElementById("forecast-grid");
const alertBox = document.getElementById("alert-box");
const recentDropdown = document.getElementById("recent-dropdown"); // for dropdown recent search thing
const recentKey = "wf_recents_v1";
const maxRecents = 6;

let currentUnit = "metric"; // Metric for Celcius, Imperial for Fahrenheit

// Event listeners
form.addEventListener("submit", handleSearch);
geoBtn.addEventListener("click", getCurrentLocation);
unitToggle.addEventListener("click", toggleUnit);

// Handle search
async function handleSearch(e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    showMessage("Please enter a city name.", "error");
    return;
  }
  await fetchWeather(city);
  saveRecent(city);
  loadRecentDropdown();
}

// Handle geolocation
function getCurrentLocation() {
  if (!navigator.geolocation) {
    showMessage("Geolocation is not supported by your browser.", "error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      await fetchWeather(null, latitude, longitude);
    },
    () => showMessage("Unable to get your location.", "error") 
    // You will get this error on most android devices if not hosted on website with https
  );
}

// Toggle units between Celsius and Fahrenheit
function toggleUnit() {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  unitToggle.textContent = currentUnit === "metric" ? "°C" : "°F";
  const city = document.getElementById("current-city").textContent;
  if (city) fetchWeather(city);
}

// Fetch weather data
async function fetchWeather(city, lat, lon) {
  showMessage("Loading weather data...", "info");

  try {
    let url = "";
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${currentUnit}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    displayCurrentWeather(data);

    // Fetch 5-day forecast
    await fetchForecast(data.coord.lat, data.coord.lon);

    showMessage(""); // Clear messages
  } catch (err) {
    showMessage(err.message, "error");
  }
}

// Display current weather
function displayCurrentWeather(data) {
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("current-icon").src = icon;
  document.getElementById("current-city").textContent = data.name;
  document.getElementById("current-desc").textContent = data.weather[0].description;
  document.getElementById("current-temp").textContent = `${Math.round(data.main.temp)}°`;
  document.getElementById("current-feels").textContent = `Feels like ${Math.round(data.main.feels_like)}°`;
  document.getElementById("current-humidity").textContent = data.main.humidity;
  document.getElementById("current-wind").textContent = data.wind.speed;

  currentCard.classList.remove("hidden");

  // Extreme temperature alerts
  // Extreme temperature alerts (Celsius + Fahrenheit aware)
const temp = data.main.temp;
let isExtremeHeat = false;
let isExtremeCold = false;

if (currentUnit === "metric") {
  // Celsius limit
  isExtremeHeat = temp >= 40;
  isExtremeCold = temp <= 5;
} else {
  // Fahrenheit thresholds (104 and 41 Fahrenheit converted from Celsius limits)
  isExtremeHeat = temp >= 104;
  isExtremeCold = temp <= 41;
}

if (isExtremeHeat) {
  alertBox.className = "mt-3 text-sm rounded-md p-2 bg-red-400/50 text-white";
  alertBox.textContent = "Extreme heat alert! Stay hydrated and avoid direct sun.";
  alertBox.classList.remove("hidden");
} else if (isExtremeCold) {
  alertBox.className = "mt-3 text-sm rounded-md p-2 bg-blue-200/50 text-white";
  alertBox.textContent = "Cold wave alert! Dress warmly and stay safe.";
  alertBox.classList.remove("hidden");
} else {
  alertBox.classList.add("hidden");
}
  // Apply background and animation
  applyBackground(data);
}


// Fetch forecast
async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`;
  const res = await fetch(url);
  const data = await res.json();

  const daily = {};

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!daily[date]) daily[date] = [];
    daily[date].push(entry);
  });

  forecastGrid.innerHTML = "";

  // Check if bg-night is active
  const isNightBg = document.body.classList.contains("bg-night");

  Object.keys(daily)
    .slice(0, 5)
    .forEach((date) => {
      const entries = daily[date];
      const avgTemp =
        entries.reduce((sum, e) => sum + e.main.temp, 0) / entries.length;
      const icon = entries[0].weather[0].icon;
      const desc = entries[0].weather[0].description;

      const card = document.createElement("div");
      card.className =
        `forecast-card ${isNightBg ? "text-white" : "text-black"} ` +
        "bg-white/20 rounded-xl p-2 sm:p-3 text-sm sm:text-base backdrop-blur shadow";

      card.innerHTML = `
        <p class="font-semibold text-xs sm:text-sm">${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" class="mx-auto w-12 h-12 sm:w-16 sm:h-16" alt="${desc}">
        <p class="text-lg sm:text-xl font-bold">${Math.round(avgTemp)}°</p>
        <p class="capitalize text-xs sm:text-sm">${desc}</p>
      `;
      forecastGrid.appendChild(card);
    });
}

// Show info or error messages
function showMessage(msg, type = "info") {
  messageArea.innerHTML = "";
  if (!msg) return;

  const box = document.createElement("div");
  box.className = type === "error" ? "error-box" : "info-box";
  box.textContent = msg;
  messageArea.appendChild(box);
}

// Specific function for creating rain animation
function createRain() {
    const rainContainer = document.getElementById("weather-animation");
    rainContainer.innerHTML = "";

    // Make rain container as tall as the scrollable page
    rainContainer.style.height = document.body.scrollHeight + "px";

    for (let i = 0; i < 200; i++) { // number of drops
        const drop = document.createElement("div");
        drop.className = "drop";
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
        drop.style.animationDelay = Math.random() * 2 + "s";
        rainContainer.appendChild(drop);
    }
}

// Apply background theme + animation
function applyBackground(data) {
  const body = document.body;
  const animLayer = document.getElementById("weather-animation");

  // Reset classes
  body.classList.remove("bg-sunny","bg-night","bg-cloudy","bg-rain","bg-snow","bg-storm","bg-mist");
  animLayer.className = "";
  animLayer.id = "weather-animation"; // preserve ID

  const w = (data.weather[0].main || "").toLowerCase();

  // Get current hour at chosen city
  const now = data.dt; // timestamp from API
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const isNight = now < sunrise || now > sunset;

  // Logic for running animation depending on weather, day/night cycle only visible on clear sky
  if (w.includes("rain") || w.includes("drizzle")) {
    body.classList.add("bg-rain");
    const rainContainer = document.getElementById("weather-animation");
    rainContainer.className = "rainy";
    createRain();
  }

  else if (w.includes("cloud")) {
    body.classList.add("bg-cloudy");
    animLayer.classList.add("cloudy");
  } 
  
  else if (w.includes("snow")) {
    body.classList.add("bg-snow");
    animLayer.classList.add("snowy");
  } 
  
  else if (w.includes("storm") || w.includes("thunder")) {
    body.classList.add("bg-storm");
    animLayer.classList.add("rainy");
  } 
  
  else if (w.includes("mist") || w.includes("fog") || w.includes("haze")) {
    body.classList.add("bg-mist");
    animLayer.classList.add("cloudy");
  } 
  
  else if(isNight) {
    body.classList.add("bg-night");
    animLayer.classList.add("night");
  }

  else {
    body.classList.add("bg-sunny");
    animLayer.classList.add("sunny");
  }
}

// recent searches (simple version)
function loadRecentDropdown() {
  // get stored cities or make an empty list
  let recents = JSON.parse(localStorage.getItem(recentKey) || "[]");

  // if nothing saved, hide the dropdown
  if (recents.length === 0) {
    recentDropdown.style.display = "none";
    recentDropdown.innerHTML = "";
    return;
  }

  // otherwise show the dropdown and fill it
  recentDropdown.style.display = "block";
  recentDropdown.innerHTML = "<option value=''>Recent Searches</option>";

  recents.forEach(city => {
    let opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    recentDropdown.appendChild(opt);
  });
}

// saves a searched city to local storage
function saveRecent(cityName) {
  if (!cityName) return;

  let recents = JSON.parse(localStorage.getItem(recentKey) || "[]");

  // remove duplicates (case insensitive)
  recents = recents.filter(c => c.toLowerCase() !== cityName.toLowerCase());

  // put newest first
  recents.unshift(cityName);

  // keep only up to MAX_RECENTS
  if (recents.length > maxRecents) {
    recents = recents.slice(0, maxRecents);
  }

  localStorage.setItem(recentKey, JSON.stringify(recents));
}

// load on start
loadRecentDropdown();

// when user picks one from dropdown
if (recentDropdown) {
  recentDropdown.addEventListener("change", () => {
    let val = recentDropdown.value;
    if (val) fetchWeather(val);
  });
}
