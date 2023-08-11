import loginService from '../services/login'
import blogService from '../services/blogs'
import { useState } from 'react'

import {
  addNotification,
  removeNotification,
} from '../reducers/notficationReducer'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'

import { TextField, Button } from '@mui/material'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      dispatch(setUser(user))
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)

      dispatch(
        addNotification({
          content: `${user.username} logged in`,
          style: 'success',
        })
      )
      setTimeout(() => {
        dispatch(removeNotification())
      }, 4000)
    } catch (exception) {
      console.log(exception)
      dispatch(
        addNotification({
          content: 'wrong username or password',
          style: 'error',
        })
      )
      setTimeout(() => {
        dispatch(removeNotification())
      }, 4000)
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="Username"
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant='contained' id="login" type="submit">
          Login
        </Button>
      </form>
    </div>
  )
}

export default Login
