// npm packages
const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")


const app = express()
app.set('view engine', 'ejs') // Tells our app to use EJS as its view engine
app.use(bodyParser.urlencoded({extended: true})) // Allows us to parse JSON
app.use(express.static("public")) // Tells our app where to find our CSS sheet

app.get("/", (req, res) => {

    const url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=5c7957d552312e3e9a79e09dd799b650&units=metric"
    let country
    let city
    let temp
    let weatherDescription

    https.get(url, (response) => {

        response.on("data", (data) => {
            const weatherData = JSON.parse(data)
            country = weatherData.sys.country
            city = weatherData.name
            temp = weatherData.main.temp
            weatherDescription = capitalizeFirstLetter(weatherData.weather[0].description)
            res.render("index", {currentCity: city, currentCountry: country, currentTemp: temp, currentWeatherDescription: weatherDescription })
        })

    })

})

app.listen(3000, () => {
    console.log("Server is running on port 3000.")
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }