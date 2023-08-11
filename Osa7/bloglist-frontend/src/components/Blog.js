import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { updateBlog } from '../reducers/blogReducer'
import commentService from '../services/comments'

import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const Blog = ({ blogs }) => {
  const dispatch = useDispatch()

  const id = useParams().id
  const blog = blogs.find((blog) => blog.id === id)

  const likeBlog = async () => {
    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    })
    dispatch(updateBlog(updatedBlog))
  }

  const addComment = (event) => {
    event.preventDefault()
    commentService
      .createComment(blog.id, { comment: event.target.comment.value })
      .then((comment) => {
        dispatch(
          updateBlog({ ...blog, comments: blog.comments.concat(comment) })
        )
      })
    event.target.comment.value = ''
  }

  if (!blog) return null

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes{' '}
        <Button variant="outlined" onClick={likeBlog}>
          like
        </Button>
      </div>
      <div>added by {blog.user.name}</div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <TextField label="comment" name="comment" />
        <div>
          <Button variant="contained" type="submit">
            add comment
          </Button>
        </div>
      </form>
      <br></br>
      <List>
        {blog.comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemIcon>
              <FiberManualRecordIcon />
            </ListItemIcon>
            <ListItemText primary={comment.content} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default Blog
