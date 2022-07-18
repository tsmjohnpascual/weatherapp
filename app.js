const express = require("express")
const https = require("https")


const app = express()

app.get("/", (req, res) => {

    const url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=5c7957d552312e3e9a79e09dd799b650&units=metric"

    https.get(url, (response) => {

        response.on("data", (data) => {
            const weatherData = JSON.parse(data)
            console.log(weatherData)
        })

    })

    res.send("Server is up and running")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000.")
})