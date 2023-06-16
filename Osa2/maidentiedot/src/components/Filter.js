const Filter = ({ filter, setFilter, setCountryName }) => {
  return (
    <div>
      <form>
        find countries{" "}
        <input
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value)
            setCountryName("")
          }}
        />
      </form>
    </div>
  )
}

export default Filter
