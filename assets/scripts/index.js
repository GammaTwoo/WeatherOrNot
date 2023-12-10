const currentWeatherEl = document.getAnimations('currentWeatherItems')
const timezone = document.getElementById('timezone')
const countryEl = document.getElementById('country')
// const weatherForecastEl = document.getElementById('weatherForecast')
const submitBtn = document.getElementById('searchBtn')
const cityInput = document.getElementById('cityInput')
const stateInput = document.getElementById('stateInput')
const countryInput = document.getElementById('countryInput')

const API_KEY = '3f86d4785d1c130f4095c54be0cdfbd6'

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

function capitalizeEveryWord(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    })
  }

function showFutureData(forecast) {
    console.log(forecast)
}

function showCurrentData(weather) {
    const { temp, humidity, pressure, wind_speed } = weather
    let summaryLower
    const summaryArray = weather.weather
    for (let i of summaryArray) {
        summaryLower = i.description
    }
    let summary = capitalizeEveryWord(summaryLower)
    const pressureInBar = pressure * 0.001

    const tempEl = document.getElementById('currentTemp')
    const humidityEl = document.getElementById('humidity')
    const pressureEl = document.getElementById('pressure')
    const windEl = document.getElementById('windSpeed')
    const summaryEl = document.getElementById('summary')

    tempEl.textContent = `${temp}° F `
    humidityEl.lastChild.textContent = `${humidity}%`
    pressureEl.lastChild.textContent = `${pressureInBar} bar`
    windEl.lastChild.textContent = `${wind_speed} mph`
    summaryEl.textContent = `${summary}`
}

function getForecast(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const current = data.current
            const future = data.daily.slice(1, 6)
            showCurrentData(current)
            showFutureData(future)
        })
}

function getGeolocation(city, state, country) {
    let stateFinal
    if (!state) {
        stateFinal = ''
    } else {
        stateFinal = `${state},`
    }

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateFinal}${country}&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            let lat
            let lon
            for(let i of data) {
                lat = i.lat
                lon = i.lon
            }
            getForecast(lat, lon)
            // getForecast(lat, lon)
    })
}

submitBtn.addEventListener('click', () => {
    let city = cityInput.value
    let state = stateInput.value
    let country = countryInput.value
    getGeolocation(city, state, country)
})


//        _------.
//       /  ,     \_
//     /   /  /{}\ |o\_
//    /    \  `--' /-' \
//   |      \      \    |
//  |              |`-, |
//  /              /__/)/
// |              | Eagle with rizz