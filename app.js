// npm packages
import express from "express"
import https from "https"
import bodyParser from "body-parser"
import fetch from 'node-fetch'

const app = express()
app.set('view engine', 'ejs') // Tells our app to use EJS as its view engine
app.use(bodyParser.urlencoded({extended: true})) // Allows us to parse text from input
app.use(express.static("public")) // Tells our app where to find our CSS sheet

const openWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q="
const appid = "&appid=5c7957d552312e3e9a79e09dd799b650"
const units = "&units=metric"

app.get("/", (req, res) => {

    const url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=5c7957d552312e3e9a79e09dd799b650&units=metric"

    https.get(url, (response) => {

        response.on("data", (data) => {
            const weatherData = JSON.parse(data)
            let country = weatherData.sys.country
            let city = weatherData.name
            let temp = Math.floor(weatherData.main.temp)
            let weatherDescription = capitalizeFirstLetter(weatherData.weather[0].description)
            res.render("index", {currentCity: city, currentCountry: country, currentTemp: temp, currentWeatherDescription: weatherDescription })
        })

    })

})

app.post("/", (req, res) => {

    let city = req.body.input

    const cityURL = `${openWeatherAPI}${city}${appid}${units}`

    https.get(cityURL, (response) => {

        response.on("data", data => {
            const cityData = JSON.parse(data)
            let newCountry = cityData.sys.country
            let newCity = cityData.name
            let newTemp = Math.floor(cityData.main.temp)
            let newWeatherDescription = capitalizeFirstLetter(cityData.weather[0].description)
            let newHigh = Math.floor(cityData.main.temp_max)
            let newLow = Math.floor(cityData.main.temp_min)
            let newPressure = cityData.main.pressure
            let newHumidity = cityData.main.humidity
            let newWindSpeed = cityData.wind.speed
            let newWindDirection = cityData.wind.deg
            let newSunrise = getTime(cityData.sys.sunrise)
            let newSunset = getTime(cityData.sys.sunset)
            res.render("newCountry", {
                newCountry: newCountry,
                newCity: newCity,
                newTemp: newTemp,
                newWeatherDescription: newWeatherDescription,
                newHigh: newHigh,
                newLow: newLow,
                newPressure: newPressure,
                newHumidity: newHumidity,
                newWindSpeed: newWindSpeed,
                newWindDirection: newWindDirection,
                newSunrise: newSunrise,
                newSunset: newSunset
            })
        })

    })

})

// app.post("/", (req, res) => {
//     let searchLocation = req.body.input
//     let latLonURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}${appid}${units}`
//     getSearchURL(latLonURL).then(x => {
//         let searchURL = x
//         https.get(searchURL, (response) => {
//             response.on("data", (data) => {
//                 const cityData = JSON.parse(data)
//                 console.log(cityData)
//         })
//         })
//     })
    
// })

// async function getSearchURL(url) {

//     const data = await fetch(url).then(response => response.json()) 
//     let latitude = data.coord.lat
//     let longitude = data.coord.lon
//     const newURL = `${openWeatherAPI}lat=${latitude}&lon=${longitude}${appid}${units}`
//     return newURL

// }

app.listen(3000, () => {
    console.log("Server is running on port 3000.")
})


// function to make the first letter of a string capital
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function getTime (time) {
    let date = new Date(time * 1000)
    let hours = date.getHours()
    let minutes = "0" + date.getMinutes()
    let formattedTime = `${hours}:${minutes.substr(-2)}`
    return formattedTime
}
