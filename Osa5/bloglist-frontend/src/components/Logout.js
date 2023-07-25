const Logout = ({ setUser, user }) => {
  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  return (
    <div>
      {user} logged in
      <button onClick={logout} id="logout">logout</button>
    </div>
  )
}

export default Logout