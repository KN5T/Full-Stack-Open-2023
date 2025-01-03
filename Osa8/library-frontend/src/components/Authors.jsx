import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"
import SetBirthyear from "./SetBirthyear"

const Authors = ({ show, token }) => {
  const {loading, error, data} = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }
  if(error) {
    return <div>can not load authors</div>
  } 

  const authors = data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && <SetBirthyear authors={authors} />}
    </div>
  )
}

export default Authors
