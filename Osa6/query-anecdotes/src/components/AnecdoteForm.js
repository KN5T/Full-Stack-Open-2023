import { useMutation, useQueryClient } from "react-query"
import { createAnecdote } from "../requests"
import { useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries('anecdotes')
      dispatch({
        type: 'setNotification',
        payload: `anecdote '${newAnecdote.content}' created`
      })
      setTimeout(() => {
        dispatch({ type: "clearNotification" })
      }, 5000)
    },
    onError: (error) => {
      console.log(error)
      dispatch({
        type: 'setNotification',
        payload: `${error.response.data.error}`
      })
      setTimeout(() => {
        dispatch({ type: "clearNotification" })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
