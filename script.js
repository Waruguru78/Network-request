const apiKey = '48b119bfa29977ee63c83c5192714518';
const weatherDisplay = document.getElementById('weatherDisplay');

async function getWeather(city, date) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayWeather(data, date);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data, selectedDate) {
    weatherDisplay.innerHTML = '';
    
    // Convert selectedDate to the start of the day
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    // Filter data to include only entries from the selected date
    const filteredData = data.list.filter(item => {
        const itemDate = new Date(item.dt_txt);
        return itemDate.toDateString() === selectedDateObj.toDateString();
    });

    filteredData.forEach((item) => {
        const { main, weather, dt_txt } = item;
        const time = new Date(dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const weatherCondition = weather[0].main.toLowerCase();
        const temp = `${Math.round(main.temp)}°C`;

        let backgroundImg = 'sunny.jpg';

        if (weatherCondition.includes('cloud')) {
            backgroundImg = 'cloudy.jpg';
        } else if (weatherCondition.includes('sun')) {
            backgroundImg = 'sunny.jpg';
        } else if (weatherCondition.includes('rain')) {
            backgroundImg = 'Rainy.jpg';
        } else if (weatherCondition.includes('fog')) {
            backgroundImg = 'foggy.jpg';
        } else if (weatherCondition.includes('snow')) {
            backgroundImg = 'snowy.jpg';
        } else if (weatherCondition.includes('storm')) {
            backgroundImg = 'stormy.jpg';
        }

        const card = `
        <div class="col-md-4 mb-4">
            <div class="card" style="background-image: url('images/${backgroundImg}'); background-size: cover; background-position: center;">
                <div class="card-body text-light bg-dark bg-opacity-75">
                    <h5 class="card-title">${time}</h5>
                    <p class="card-text">${weather[0].description}</p>
                    <p class="card-text">${temp}</p>
                    <p class="card-text">Humidity: ${main.humidity}%</p>
                </div>
            </div>
        </div>
        `;

        weatherDisplay.innerHTML += card;
    });

    if (filteredData.length === 0) {
        weatherDisplay.innerHTML = '<p class="text-light">No weather data available for the selected date.</p>';
    }
}

document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const selectedDate = document.getElementById('dateInput').value;
    if (city && selectedDate) {
        getWeather(city, selectedDate);
    } else {
        alert('Please enter a city name and select a date');
    }
});
