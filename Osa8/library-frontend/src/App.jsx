import { useEffect, useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import { useApolloClient, useQuery, useSubscription } from "@apollo/client"
import Recommendations from "./components/Recommendations"
import { BOOK_ADDED, USER, ALL_BOOKS } from "./queries"

export const updateCache = (cache, query, addedBook) => {
  const uniqueByTitle = (a) => {
    let seen = new Set()
    return a.filter(book => {
      let title = book.title
      return seen.has(title) ? false : seen.add(title)
    })
  }

  cache.updateQuery(query, (data) => {
    if(data && data.allBooks) {
      return {
        allBooks: uniqueByTitle(data.allBooks.concat(addedBook))  
      }
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [genre, setGenre] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const result = useQuery(USER)

  useEffect(() => {
    if(token) {
      result.refetch()
    }
  }, [token])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      if (data) {
        const addedBook = data.data.bookAdded
        window.alert(`Book "${addedBook.title}" by ${addedBook.author.name} added`)
        updateCache(client.cache, {query: ALL_BOOKS, variables: {genre}}, addedBook)
      }
    },
  })

  if(result.loading) return <div>loading...</div>

  const user = result.data.me

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("login")
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books
        show={page === "books"}
        setGenre={setGenre}
        genre={genre}
      />

      <NewBook show={page === "add"} currentGenre={genre} />

      <Recommendations show={page === "recommend"} favoriteGenre={user?.favoriteGenre
      } />

      <LoginForm
        show={page === "login"}
        setPage={setPage}
        setToken={setToken}
      />
    </div>
  )
}

export default App
