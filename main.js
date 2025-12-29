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

searchButton.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (city) {
    const data = await getData(city);
    console.log(data.timezone, data.temp);
  } else {
    return alert("No City Entered");
  }
});
