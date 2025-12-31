"use strict";

// dom inputs
const cityInput = document.querySelector(".searchInput");
const searchButton = document.querySelector(".searchButton");

// code
const API_KEY = "UV9EEZLAVA9YVA53UDZSYHDU7";

// toggle code
let isCelsius = false;
let currentTempF = null;


async function fetchWeatherData(city) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}`;
    const weatherInfo = await fetch(url);
    if (!weatherInfo.ok) {
      throw new Error(`HTTP error! status: ${weatherInfo.status}`);
    }
    return await weatherInfo.json();
}

async function getData(city) {
  const data = await fetchWeatherData(city);
  return {
    timezone: data.timezone,
    description: data.description,
    temp: data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
    humidity: data.currentConditions.humidity,
    solarradiation: data.currentConditions.solarradiation,
    windspeed: data.currentConditions.windspeed,
  };
}

function displayData(data) {
  currentTempF = data.temp;
  document.querySelector(".timezone").textContent = data.timezone;
  updateTemperatureDisplay();
  document.querySelector(".conditions").textContent = data.conditions;
  document.querySelector(".humidity").textContent = data.humidity;
  document.querySelector(".windSpeed").textContent = data.windspeed;
  document.querySelector(".solarRadiation").textContent = data.solarradiation;
  document.querySelector(".description").textContent = data.description;
}

function updateTemperatureDisplay() {
  const tempElement = document.querySelector(".temp");
  if (isCelsius) {
    const celsius = convertoCelcius(currentTempF);
    tempElement.textContent = `${celsius} °C`;
  } else {
    tempElement.textContent = `${currentTempF} °F`;
  }
}

function addLoadingMessage() {
  clearUI();
  const loadingHtml = `
  <div id="content-loader">
    <p>Loading...</p>
  </div>
`;
  document.body.insertAdjacentHTML("beforeend", loadingHtml);
}

function addWeatherDataSection() {
  clearUI();
  const dataSection = `<section class="dataSection">
      <p class="timezone"></p>
      <div class="temp-container">
        <p class="temp"></p>
        <button class="toggleUnit">°C</button>
      </div>
      <p class="conditions"></p>
      <div class="extraDetails">
        <div>
          <span class="label">Humidity: </span>
          <span class="humidity value"></span>
        </div>
        <div>
          <span class="label">Wind Speed:</span>
          <span class="windSpeed value"></span>
        </div>
        <div>
          <span class="label">Solar Radiation:</span>
          <span class="solarRadiation value"></span>
        </div>
      </div>
      <p class="description"></p>
    </section>`;
  document.body.insertAdjacentHTML("beforeend", dataSection);
  const toggleButton = document.querySelector(".toggleUnit");
  toggleButton.addEventListener("click", () => {
    isCelsius = !isCelsius;
    updateTemperatureDisplay();
    toggleButton.textContent = isCelsius ? "°F" : "°C";
  });
}

function showWelcomeMessage() {
  const welcomeSectionHTML = `<section class="welcomeSection">
      <div class="weather-content">
        <h1>🌤️ Welcome to Weather App</h1>
        <p>Enter a city name to get started</p>
        <p class="hint">
          Search for any city to see current weather conditions
        </p>
      </div>
    </section>`;
  document.body.insertAdjacentHTML("beforeend",welcomeSectionHTML);
}

function convertoCelcius(fahrenheit) {
  return ((fahrenheit - 32) * 5/9).toFixed(1);
}

function showError(message) {
  clearUI();
  const errorSection = `<section class="errorSection">
      <div class="error-content">
        <p>❌ ${message}</p>
        <p class="hint">Please check the city name and try again.</p>
      </div>
    </section>`;
  document.body.insertAdjacentHTML('beforeend',errorSection);
}

function clearUI () {
  const welcomeSection = document.querySelector(".welcomeSection");
  const errorSection = document.querySelector(".errorSection");
  const dataSection = document.querySelector(".dataSection");
  const loader = document.getElementById("content-loader");
  if (loader) {
    loader.remove();
  }
  if (dataSection) {
    dataSection.remove();
  }
  if (welcomeSection){
    welcomeSection.remove();
  }
  if (errorSection) {
    errorSection.remove()
  };
}

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

searchButton.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  cityInput.value = '';
  try {
    if (city) {
      addLoadingMessage();
      const data = await getData(city);
      isCelsius = false;
      addWeatherDataSection();
      displayData(data);
    } else {
      return alert("No City Entered");
    }
  }
  catch (error) {
    showError(error.message);
  }
});

window.addEventListener("DOMContentLoaded", showWelcomeMessage);
