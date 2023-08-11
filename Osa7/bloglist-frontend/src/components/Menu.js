import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { removeUser } from '../reducers/userReducer'

import { Button, AppBar, Toolbar,  } from "@mui/material"

const Menu = () => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    const logout = () => {
      window.localStorage.removeItem('loggedBlogAppUser')
      dispatch(removeUser())
    }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            <div> 
              {user.name} logged in{' '}
              <Button variant="contained" onClick={logout} id="logout">
                logout
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
}

export default Menu