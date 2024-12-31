import { useMutation } from "@apollo/client"
import { useState } from "react"
import { updateCache } from "../App"
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  ALL_GENRES,
  CREATE_BOOK,
  RECOMMENDED_BOOKS,
} from "../queries"

const NewBook = ({ show, currentGenre }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])    

  const [createBook] = useMutation(CREATE_BOOK, {
   refetchQueries: [ALL_AUTHORS, RECOMMENDED_BOOKS],
   update: (cache, response) => {
    cache.updateQuery({query: ALL_GENRES}, (data) => {

      if(data && data.allGenres) {
        const newGenres = genres.filter(g => !data.allGenres.includes(g))
        return {
          allGenres: data.allGenres.concat(newGenres) 
        }
      }
    })
    updateCache(cache, { query: ALL_BOOKS, variables: {genre: currentGenre} }, response.data.addBook)
   }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { title, published, author, genres } })

    setTitle("")
    setPublished("")
    setAuthor("")
    setGenres([])
    setGenre("")
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }

  return (
    <div>
      <h2>add a new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.valueAsNumber)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
