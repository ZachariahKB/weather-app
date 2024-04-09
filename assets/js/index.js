const apiKey = '0ba66554deac828ea95e757193d6e2f3';

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName === '') return;
    
    try {
        const currentWeatherData = await getCurrentWeather(cityName);
        const forecastData = await getForecast(cityName);
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
        addToSearchHistory(cityName);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
});

async function getCurrentWeather(cityName) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

async function getForecast(cityName) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

function displayCurrentWeather(data) {
    currentWeatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        forecastDiv.innerHTML += `
            <div>
                <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${forecast.main.temp}°C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            </div>
        `;
    }
}

function addToSearchHistory(cityName) {
    const searchHistoryItem = document.createElement('div');
    searchHistoryItem.textContent = cityName;
    searchHistoryItem.classList.add('search-history-item');
    searchHistoryItem.addEventListener('click', async function() {
        try {
            const currentWeatherData = await getCurrentWeather(cityName);
            const forecastData = await getForecast(cityName);
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        }
    });
    searchHistoryDiv.appendChild(searchHistoryItem);
}