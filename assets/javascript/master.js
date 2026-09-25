const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const btn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const resultArea = document.getElementById("resultArea");

input.addEventListener("input", () => {
  input.value = input.value.replace(/[^a-zA-Z\s-]/g, "");
});

async function fetchweather(city) {
  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("City not found!");

  const data = await response.json();
  return data;
}

function extractMyinfoWeather(data, searchCity) {
  const current = data.current_condition[0];
  const area = data.nearest_area[0];

  return {
    city: searchCity,
    country: area.country[0].value,
    tempC: current.temp_C,
    feelsLikeC: current.FeelsLikeC,
    humidity: current.humidity,
    description: current.weatherDesc[0].value,
  };
}

function renderLoading() {
  resultArea.innerHTML = "";
  statusEl.innerHTML = " Searching ...";
}

function renderError() {
  statusEl.innerHTML = "";
  resultArea.innerHTML = `
    <div class="error-card">
      <span>😕</span>
      <div>City not found or something went wrong. Please try again.</div>
    </div>
    `;
}

function renderResult(info) {
  statusEl.innerHTML = "";
  resultArea.innerHTML = `
    <div class="result-card">
      <h2 class="result-city">${info.city}, ${info.country}</h2>
      <p class="result-temp">${info.tempC}°C</p>
      <p class="result-desc">${info.description}</p>
      <p class="result-extra"> Real Feeling: ${info.feelsLikeC}°C | Humidity: ${info.humidity}%</p>
    </div>
    `;
}

async function handleSearch(city) {
  if (!city) return;

  btn.disabled = true;
  renderLoading();

  try {
    const data = await fetchweather(city);
    const info = extractMyinfoWeather(data, city);
    renderResult(info);
  } catch {
    renderError();
  } finally {
    btn.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearch(input.value.trim());
});
