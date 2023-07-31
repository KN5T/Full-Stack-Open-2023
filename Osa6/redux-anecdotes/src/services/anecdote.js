import axios from "axios"

const baseUrl = 'http://localhost:3003/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const anecdoteObject = {
    content,
    votes: 0
  }
  const response = await axios.post(baseUrl, anecdoteObject)
  return response.data
}

const update = async (anecdoteObject) => {
  const newAnecdoteObject = {
    content: anecdoteObject.content,
    votes: anecdoteObject.votes + 1,
    id: anecdoteObject.id
  }

  const response = await axios.put(`${baseUrl}/${newAnecdoteObject.id}`, newAnecdoteObject)
  return response.data
}

export default { getAll, createNew, update }