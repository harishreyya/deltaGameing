const weatherApp = document.getElementById('app');

let weatherData = null;
let isLoading = false;
let errorMessage = '';

const fetchWeatherData = async (query) => {
    isLoading = true;
    errorMessage = '';
    renderWeatherApp();

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=6d514e6c31ef6012472bbc8bfa14c2d3`);
        const data = await response.json();
        if (data.cod === '404') {
            throw new Error('City not found');
        }
        weatherData = data;
    } catch (error) {
        errorMessage = error.message;
        weatherData = null;
    } finally {
        isLoading = false;
        renderWeatherApp();
    }
};

const handleCitySearch = () => {
    const cityInput = document.getElementById('cityInput').value;
    fetchWeatherData(cityInput);
};

const renderSearch = () => {
    const searchHtml = `
        <div class="search">
            <input id="cityInput" class="input" type="text" placeholder="Enter City Name">
            <button class="button" onclick="handleCitySearch()">Search</button>
        </div>
    `;
    return searchHtml;
};

const renderWeatherDetails = () => {
    if (isLoading) {
        return '<p>Loading...</p>';
    }

    if (errorMessage) {
        return `<p>${errorMessage}</p>`;
    }

    if (!weatherData) {
        return '';
    }

    const { name, main: { temp, humidity, pressure }, sys: { sunrise, sunset }, timezone } = weatherData;

    const weatherDetailsHtml = `
        <div class="top">
            <h1>${Math.floor(temp - 273.15)} °C</h1>
            <div class="timezone"><p>${name}  </p></div>
        </div>
        <div class="lower">
            <p>Pressure: <span>${pressure} hpa</span></p>
            <p>Humidity: <span>${humidity}%</span></p>
        </div>
        <div class="lower1">
            <p>Sunrise: <span class="set">${new Date(sunrise * 1000).toLocaleTimeString()}</span></p>
            <p>Sunset: <span class="set">${new Date(sunset * 1000).toLocaleTimeString()}</span></p>
        </div>
        <div class="map">
            <iframe src="https://maps.google.com/maps?q=${name}&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
        </div>
    `;
    return weatherDetailsHtml;
};

const renderWeatherApp = () => {
    const appHtml = `
        ${renderSearch()}
        ${renderWeatherDetails()}
    `;
    weatherApp.innerHTML = appHtml;
};

document.addEventListener('DOMContentLoaded', () => {
    renderWeatherApp();
});
