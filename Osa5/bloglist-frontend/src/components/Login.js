import loginService from '../services/login'
import blogService from '../services/blogs'
import { useState } from 'react'

const Login = ({ setUser, setMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      setUser(user)
      blogService.setToken(user.token)

      setMessage( { content: `${user.username} logged in`, style: 'success' })
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    } catch (exception) {
      console.log(exception)
      setMessage({ content: 'wrong username or password', style: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            id='username'
            name="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            id='password'
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login' type="submit">Login</button>
      </form>
    </div>
  )
}


export default Login