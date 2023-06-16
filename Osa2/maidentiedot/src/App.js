import { useState, useEffect } from "react"
import countryService from "./services/countries"
import Filter from "./components/Filter"
import Countries from "./components/Countries"

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [countryName, setCountryName] = useState("")

  useEffect(() => {
    countryService.getAll().then((initialCountries) => {
      setCountries(initialCountries.map((c) => c.name.common))
    })
  }, [])

  useEffect(() => {
    const filteredNames =
      filter === ""
        ? countries
        : countries.filter((c) =>
            c.toLowerCase().includes(filter.toLowerCase())
          )
    setFilteredCountries(filteredNames)
  }, [filter])

  return (
    <div>
      <Filter
        filter={filter}
        setFilter={setFilter}
        setCountryName={setCountryName}
      />
      <Countries
        countries={filteredCountries}
        countryName={countryName}
        setCountryName={setCountryName}
      />
    </div>
  )
}

export default App

