import { useEffect } from 'react'
import Login from './components/Login'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import BlogPage from './components/BlogPage'
import Menu from './components/Menu'

import { useDispatch, useSelector } from 'react-redux'
import { setBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { setUsers } from './reducers/usersReducer'
import userService from './services/users'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Container } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blog)
  const users = useSelector((state) => state.users)

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)))
    userService.getAll().then((users) => dispatch(setUsers(users)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const currentUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(currentUser))
      blogService.setToken(currentUser.token)
    }
  }, [])


  if (user === null) {
    return (
      <Container>
        <div>
          <h2>Log in to application</h2>
          <Notification />
          <Login />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Router>
        <div>
          <Menu />
          <h2>blog app</h2>
          <Notification />
          <Routes>
            <Route path="/" element={<BlogPage blogs={blogs} user={user} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User users={users} />} />
            <Route path="/blogs/:id" element={<Blog blogs={blogs} />} />
          </Routes>
        </div>
      </Router>
    </Container>
  )
}

export default App
