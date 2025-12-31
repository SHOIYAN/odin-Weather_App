"use strict";

// dom inputs
const cityInput = document.querySelector(".searchInput");
const searchButton = document.querySelector(".searchButton");

// code
const API_KEY = "UV9EEZLAVA9YVA53UDZSYHDU7";

async function fetchWeatherData(city) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}`;
  try {
    const weatherInfo = await fetch(url);
    if (!weatherInfo.ok) {
      throw new Error(`HTTP error! status: ${weatherInfo.status}`);
    }
    const locationData = await weatherInfo.json();
    return locationData;
  } catch (error) {
    console.error(error);
  }
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
  document.querySelector(".timezone").textContent = data.timezone;
  document.querySelector(".temp").textContent = `${data.temp} °C`;
  document.querySelector(".conditions").textContent = data.conditions;
  document.querySelector(".humidity").textContent = data.humidity;
  document.querySelector(".windSpeed").textContent = data.windspeed;
  document.querySelector(".solarRadiation").textContent = data.solarradiation;
  document.querySelector(".description").textContent = data.description;
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
      <p class="temp"></p>
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

function clearUI () {
  const welcomeSection = document.querySelector(".welcomeSection");
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
}

searchButton.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (city) {
    addLoadingMessage();
    const data = await getData(city);
    addWeatherDataSection();
    displayData(data);
  } else {
    return alert("No City Entered");
  }
});

window.addEventListener("DOMContentLoaded", showWelcomeMessage);
