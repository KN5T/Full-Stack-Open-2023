import Country from "./Country"

const Countries = ({ countries, countryName, setCountryName }) => {
  const handleClick = (name) => {
    setCountryName(name)
  }

  if (countries.length === 0) {
    return
  }

  if (countryName !== "") {
    return (
      <div>
        <Country name={countryName} />
      </div>
    )
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((name) => (
          <div key={name}>
            {name}
            <button onClick={() => handleClick(name)}>show</button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <Country name={countries[0]} />
    </div>
  )
}

export default Countries
