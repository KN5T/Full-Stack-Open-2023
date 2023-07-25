import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const currentUser = JSON.parse(loggedUserJSON)
      setUser(currentUser)
      blogService.setToken(currentUser.token)
    }
  }, [])

  const blogFormRef = useRef()

  const addBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blog)
      newBlog.user = { id: newBlog.user, name: user.name, username: user.username }
      setBlogs(blogs.concat(newBlog))

      setMessage({
        content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        style: 'success',
      })
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    } catch (exception) {
      console.log(exception)
      console.log('error', exception.response.data.error)
      setMessage({ content: exception.response.data.error, style: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    }
  }

  const updateBlog = async (blog) => {
    blog.likes += 1
    const updatedBlog = await blogService.update(blog)
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog ))
  }

  const sortedBlogs = blogs.sort((a,b,) => {
    return b.likes - a.likes
  })

  const deleteBlog = async (blog) => {

    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const id = blog.id
      await blogService.remove(id)

      setBlogs(blogs.filter((b) => b.id !== id))
    }
  }

  if(user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <Login
          setUser={setUser}
          setMessage={setMessage}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <Logout setUser={setUser} user={user.name} />
      <br></br>
      <Togglable buttonName="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          userName={user.name}
        />
      ))}
    </div>
  )
}

export default App