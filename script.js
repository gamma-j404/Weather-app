const button = document.querySelector("#searchBtn");
const cityInput = document.querySelector("#cityInput");
const weatherDisplay = document.querySelector("#weatherDisplay");

button.addEventListener("click", function () {
  const city = cityInput.value.trim();

  if (city === "") {
    weatherDisplay.textContent = "Please enter a city.";
    return;
  }

  getWeather(city);
});

async function getWeather(city) {
  weatherDisplay.textContent = "Loading weather...";

  try {
    // Find the city
    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Could not find the city.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherDisplay.textContent = "City not found. Try another city.";
      return;
    }

    const location = geoData.results[0];

    // Get the weather using the city's coordinates
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Could not retrieve weather data.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    // Display the weather
    weatherDisplay.innerHTML = `
      <h2>Weather in ${location.name}</h2>
      <p>Temperature: ${current.temperature_2m} °C</p>
      <p>Feels like: ${current.apparent_temperature} °C</p>
      <p>Humidity: ${current.relative_humidity_2m}%</p>
      <p>Wind speed: ${current.wind_speed_10m} km/h</p>
      <p>Weather code: ${current.weather_code}</p>
    `;
  } catch (error) {
    weatherDisplay.textContent =
      "Unable to retrieve weather. Check your internet connection and try again.";
    console.error(error);
  }
}