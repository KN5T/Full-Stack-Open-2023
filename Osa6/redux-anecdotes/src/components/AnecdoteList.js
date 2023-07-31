import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const Vote = ({anecdote, handleClick}) => {
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }
  
  return (
    <div>
      has {anecdote.votes}
      <button onClick={() => vote(anecdote)}>vote</button>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if(filter === '') {
      return anecdotes
    } else {
      return anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    }
  })
  
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <Vote anecdote={anecdote} />
      </div>
      ))}
    </div>
  )
}

export default AnecdoteList
