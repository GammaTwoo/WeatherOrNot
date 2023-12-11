const futureForecastEl = document.getElementById('futureForecast')

let historyArr = JSON.parse(localStorage.getItem('historyArr')) || [];

if (!Array.isArray(historyArr)) {
    console.error('Data in Local Storage is not an array');
    historyArr = [];
}

const API_KEY = '3f86d4785d1c130f4095c54be0cdfbd6'

function loadHistory(history) {
    const historyEl = document.getElementById('history')
    historyEl.textContent = ''
    const fragment = document.createDocumentFragment()
    for ( let i = 0 ; i < history.length ; i++ ) {
        const newLiEl = document.createElement('button')
        newLiEl.classList.add(`history-${i}`)
        newLiEl.classList.add('list-group-item')
        newLiEl.classList.add('list-group-item-action')
        newLiEl.textContent = `${history[i]}`
        fragment.appendChild(newLiEl)

        newLiEl.addEventListener('click', () => {
            const [city, ...rest] = history[i].split(', ');
            
            let country, state;
            
            if (rest.length > 1) {
                state = rest.shift();
                country = rest.join(', ');
            } else {
                state = null;
                country = rest[0];
            }

            futureForecastEl.innerHTML = '';
            localStorageHandler(city, state, country);
            fetchGeolocation(city, state, country);
        })
    }
    historyEl.appendChild(fragment)
}

const capitalize = str => str.replace(/\b\w/g, char => char.toUpperCase())

function showFutureForecast(forecast) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    for ( let i = 0 ; i < forecast.length ; i++ ) {
        const { dt, temp, weather } = forecast[i]
        const date = new Date(dt * 1000)
        const dayOfWeek = date.getDay()
        const day = days[dayOfWeek]
        let description
        let icon
        for (let j of weather) {
            description = capitalize(j.description)
            icon = j.icon
        }
        
        const forecastPartial = document.createElement(`div`)
            forecastPartial.classList.add('weather-forecast')
            forecastPartial.classList.add('col-3')
            forecastPartial.id = `weatherForecast${day}`
        forecastPartial.innerHTML = `
        <div class="day">${day}</div>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="" class="icon">
        <div class="summary" id="summary">${description}</div>
        <div class="temp">High: ${temp.max}° F</div>
        <div class="temp">Low ${temp.min}° F</div>
        `
        futureForecastEl.appendChild(forecastPartial)
    }
}

function showCurrentWeather(weather) {
    const { temp, humidity, pressure, wind_speed } = weather
    let summaryLower
    let icon
    const summaryArray = weather.weather
    for (let i of summaryArray) {
        summaryLower = i.description
        icon = i.icon
    }
    const summary = capitalize(summaryLower)
    const pressureInInHg = pressure * 0.02953
    
    const img = document.getElementById('currentIcon')
    const tempEl = document.getElementById('currentTemp')
    const humidityEl = document.getElementById('humidity')
    const pressureEl = document.getElementById('pressure')
    const windEl = document.getElementById('windSpeed')
    const summaryEl = document.getElementById('summary')
    
    img.setAttribute('src', `http://openweathermap.org/img/w/${icon}.png`)
    tempEl.textContent = `${temp}° F`
    humidityEl.lastChild.textContent = `${humidity}%`
    pressureEl.lastChild.textContent = `${pressureInInHg} inHg`
    windEl.lastChild.textContent = `${wind_speed} mph`
    summaryEl.textContent = `${summary}`
}

function fetchForecast(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        const current = data.current
        const future = data.daily.slice(1, 6)
        showCurrentWeather(current)
        showFutureForecast(future)
    })
}

function fetchGeolocation(city, state, country) {
    let stateFinal = ''
    if (state) {
        stateFinal = `${state},`
    }
    
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateFinal}${country}&limit=5&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        let lat,lon
        for(let i of data) {
            lat = i.lat
            lon = i.lon
        }
        fetchForecast(lat, lon)
    })
}

function localStorageHandler(city, state, country) {
    const stateStr = state ? `${state}, ` : '';
    const placeStr = `${city}, ${stateStr}${country}`;

    if (!historyArr.includes(placeStr)) {
        historyArr.unshift(placeStr);
        arrOfFive = historyArr.slice(0,5)
        localStorage.setItem('historyArr', JSON.stringify(arrOfFive));
        loadHistory(arrOfFive);
    } else {
        console.log(`${placeStr} already exists in historyArr.`);
    }
}

function init() {
    const submitBtn = document.getElementById('searchBtn')
    
    setInterval(() => {
        const timeEl = document.getElementById('time')
        const dateEl = document.getElementById('date')
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        const time = new Date()
        const month = time.getMonth()
        const date = time.getDate()
        const day = time.getDay()
        const hour = time.getHours()
        const hour12 = hour >= 13 ? hour %12: hour
        const minutes = time.getMinutes()
        const meridian = hour <= 12 ? 'AM' : 'PM'
        
        timeEl.innerHTML = `${hour12}:${minutes} <span id="meridian">${meridian}</span>`
        
        dateEl.innerHTML = `${days[day]}, ${months[month]} ${date}`
        
    }, 1000)
    
    loadHistory(historyArr)
    
    submitBtn.addEventListener('click', () => {
        const cityInput = document.getElementById('cityInput')
        const stateInput = document.getElementById('stateInput')
        const countryInput = document.getElementById('countryInput')
        
        const city = cityInput.value
        const state = stateInput.value
        const country = countryInput.value
        
        futureForecastEl.innerHTML = ''
        
        localStorageHandler(city, state, country)
        fetchGeolocation(city, state, country)
    })
}

document.addEventListener('DOMContentLoaded', init)
//        _------.
//       /  ,     \_
//     /   /  /{}\ |o\_
//    /    \  `--' /-' \
//   |      \      \    |
//  |              |`-, |
//  /              /__/)/
// |              | Eagle with rizz