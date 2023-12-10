const dateEl = document.getElementById('date')
const currentWeatherEl = document.getAnimations('currentWeatherItems')
const timezone = document.getElementById('timezone')
const countryEl = document.getElementById('country')
const weatherForecastEl = document.getElementById('weatherForecast')
const currentTempEl = document.getElementById('currentTemp')

const API_KEY = '3f86d4785d1c130f4095c54be0cdfbd6'

setInterval(() => {
    const timeEl = document.getElementById('time')
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

function showCurrentWeather() {

}

function showForecastData() {

}

function getForecast() {
    navigator.geolocation.getCurrentPosition((data) => {
        console.log(data)
        let { latitude , longitude } = data.coords

        fetch(`
        https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${API_KEY}
        `).then(res => res.json()).then(data => {
            console.log(data)
        })

        fetch(`
        https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}
        `).then(res => res.json()).then(data => {
            console.log(data)

            showForecastData(data)
        })
    })

    
}
getForecast()