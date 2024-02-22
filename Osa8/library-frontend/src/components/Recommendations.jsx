import { useQuery } from "@apollo/client"
import BooksTable from "./BooksTable"
import { RECOMMENDED_BOOKS } from "../queries"
import { useEffect, useState } from "react"

const Recommendations = ({ show, favoriteGenre }) => {
  const result = useQuery(RECOMMENDED_BOOKS, {
    variables: { genre: favoriteGenre },
  })
  /*
  useEffect(() => {
    result.refetch()
  }, [show])
*/
  if (!show) {
    return null
  }

  if (result.loading) return <div>loading...</div>

  const books = result.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
      <BooksTable books={books} />
    </div>
  )
}

export default Recommendations
