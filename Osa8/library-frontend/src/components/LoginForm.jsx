import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { LOGIN, USER } from "../queries"

const LoginForm = ({ show, setPage, setToken, setUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [login, result] = useMutation(LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setPage("authors")
      setToken(token)
      localStorage.setItem("bookApp-user-token", token)
      setUsername("")
      setPassword("")
    }
  }, [result.data])

  if (!show) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>username</label>
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          ></input>
        </div>
        <div>
          <label>password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          ></input>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
