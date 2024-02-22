import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import { useApolloClient, useQuery, useSubscription } from "@apollo/client"
import Recommendations from "./components/Recommendations"
import { ALL_BOOKS, BOOK_ADDED, FAVORITE_GENRE } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const books = useQuery(ALL_BOOKS)
  const favoriteResult = useQuery(FAVORITE_GENRE)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      if (data) {
        console.log("data")
        const { title, author } = data.data.bookAdded
        window.alert(`Book "${title}" by ${author.name} added`)
        /*
        client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(data.data.bookAdded),
          }
        })*/
      }
    },
  })

  if (favoriteResult.loading || books.loading) return <div>loading...</div>

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
        refetchBooks={books.refetch}
        books={books.data.allBooks}
      />

      <NewBook show={page === "add"} />

      <Recommendations
        show={page === "recommend" && token}
        favoriteGenre={
          !favoriteResult.data ? null : favoriteResult.data.favoriteGenre
        }
      />

      <LoginForm
        show={page === "login"}
        setPage={setPage}
        setToken={setToken}
        refetchUserData={favoriteResult.refetch}
      />
    </div>
  )
}

export default App
