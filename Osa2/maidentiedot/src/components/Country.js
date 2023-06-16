import countryService from "../services/countries"
import Weather from "./Weather"
import { useState, useEffect } from "react"

const Country = ({ name }) => {
  const [country, setCountry] = useState("")

  useEffect(() => {
    countryService.getCountry(name).then((response) => {
      setCountry(response)
    })
  }, [name])

  if (!country) {
    return
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <div>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </div>
      <div>
        <img src={country.flags.png} alt={`flag if ${country.name.common}`} />
      </div>
      <div>
        <Weather capital={country.capital[0]} />
      </div>
    </div>
  )
}

export default Country
