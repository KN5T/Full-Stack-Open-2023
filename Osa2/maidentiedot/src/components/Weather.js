import { useEffect, useState } from "react"
import axios from "axios"

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState("")

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
    axios.get(url).then((response) => {
      setWeather(response.data)
    })
  }, [capital])

  if (!weather) return

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={iconUrl} alt="icon"></img>
      <p>wind {weather.wind.speed} m/s </p>
    </div>
  )
}

export default Weather
