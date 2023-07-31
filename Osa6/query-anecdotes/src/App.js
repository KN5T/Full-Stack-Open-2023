import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from "./requests"

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useNotificationDispatch } from "./NotificationContext"

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries('anecdotes')
      dispatch({
        type: "setNotification",
        payload: `anecdote '${updatedAnecdote.content}' voted`,
      })
      setTimeout(() => {
        dispatch({ type: "clearNotification" })
      }, 5000)
    }
  })

  const result = useQuery("anecdotes", getAnecdotes, { retry: false })

  if(result.isLoading) {
    return <div>is loading...</div>
  }

  if(result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ 
      ...anecdote, votes: anecdote.votes + 1
    })
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
