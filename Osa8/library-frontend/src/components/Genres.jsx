import { useQuery } from "@apollo/client"
import { ALL_GENRES } from "../queries"

const Genres = ({ setGenre }) => {
  const result = useQuery(ALL_GENRES)

  if (result.loading) {
    return <div>loading...</div>
  }

  const genres = result.data.allGenres

  return (
    <div>
      {genres.map((genre) => (
        <button onClick={() => setGenre(genre)} key={genre}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Genres
