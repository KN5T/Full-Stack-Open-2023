import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    addBlogToUser(state, action) {
      const newBlog = action.payload.newBlog
      const id = action.payload.id

      return state.map((user) =>
        user.id === id
          ? { ...user, blogs: user.blogs.concat(newBlog) }
          : user
      )
    },
    removeBlogFromUser(state, action) {
      const userId = action.payload.userId
      const blogId = action.payload.blogId
      
      return state.map((user) =>
        user.id === userId ? { ...user, blogs: user.blogs.filter(blog => blog.id !== blogId) } : user
      )
    },
  },
})


export const { setUsers, addBlogToUser, removeBlogFromUser } = usersSlice.actions
export default usersSlice.reducer
