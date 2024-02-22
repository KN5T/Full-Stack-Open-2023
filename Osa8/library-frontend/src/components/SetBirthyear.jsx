import { useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, SET_BORNYEAR } from "../queries"

const SetBirthyear = ({ authors }) => {
  const [name, setName] = useState(authors[0].name)
  const [born, setBorn] = useState("")

  const [setBornYear] = useMutation(SET_BORNYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const hanldeSubmit = (event) => {
    event.preventDefault()
    setBorn("")
    setBornYear({ variables: { name, born } })
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={hanldeSubmit}>
        <div>
          name
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map((author) => (
              <option key={author.name}>{author.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>born</label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.valueAsNumber)}
          ></input>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthyear
