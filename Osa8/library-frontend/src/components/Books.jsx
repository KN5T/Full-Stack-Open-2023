
import Genres from "./Genres"
import { useEffect, useState } from "react"
import BooksTable from "./BooksTable"

const Books = ({ show, refetchBooks, books }) => {
  const [genre, setGenre] = useState(null)

  useEffect(() => {
    refetchBooks()
  }, [show])

  useEffect(() => {
    refetchBooks({ genre })
  }, [genre])

  if (!show) {
    return null
  }

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
