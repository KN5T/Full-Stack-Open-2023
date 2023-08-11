import { useState } from 'react'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { addNotification, removeNotification } from '../reducers/notficationReducer'
import { appendBlog } from '../reducers/blogReducer'
import { addBlogToUser } from '../reducers/usersReducer'

import { Button, TextField } from '@mui/material'

const BlogForm = ({ user, toggleVisibility }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      newBlog.user = {
        id: newBlog.user,
        name: user.name,
        username: user.username,
      }
      console.log('newblog', newBlog)
      toggleVisibility()
      dispatch(appendBlog(newBlog))
      dispatch(addBlogToUser({ id: newBlog.user.id, newBlog }))

      dispatch(
        addNotification({
          content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
          style: 'success',
        })
      )
      setTimeout(() => {
        dispatch(removeNotification())
      }, 4000)
    } catch (exception) {
      dispatch(
        addNotification({
          content: exception.response.data.error,
          style: 'error',
        })
      )
      setTimeout(() => {
        dispatch(removeNotification())
      }, 4000)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const blog = { title, author, url }

    await addBlog(blog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title"
            id="title"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            id="author"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            id="url"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button variant="contained" id="createBtn" type="submit">
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
