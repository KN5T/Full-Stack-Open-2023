
import Genres from "./Genres"
import { useEffect } from "react"
import BooksTable from "./BooksTable"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Books = ({ show, setGenre, genre }) => {

  const {loading, error, data, refetch} = useQuery(ALL_BOOKS, {variables: {genre}})

  useEffect(() => {
    refetch({genre})
  }, [genre])

  if (!show) {
    return null
  }

  if(loading) return <div>...loading</div>
  if(error) return <div>can not load books</div>

  const books = data.allBooks

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <b>{genre}</b>
        </p>
      )}
      <BooksTable books={books} />
      <Genres setGenre={setGenre} />
    </div>
  )
}

export default Books
