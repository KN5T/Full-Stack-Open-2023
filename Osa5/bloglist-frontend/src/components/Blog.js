import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, userName }) => {
  const [showData, setShowData] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLikeButtonClick = () => {
    console.log('clickec', blog.title)

    updateBlog(blog)
  }

  const handleRemoveButtonclick = () => {
    deleteBlog(blog)
  }

  if(showData) {
    return (
      <div className='blog' style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setShowData(false)}>hide</button>
        </div>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blog.likes}
          <button id='likeButton' onClick={handleLikeButtonClick}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.name === userName && (
          <div>
            <button id='removeBtn' style={{ backgroundColor: 'lightblue' }} onClick={handleRemoveButtonclick}>
              remove
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={blogStyle} onClick={() => setShowData(true)}>
      {blog.title} {blog.author}
      <button onClick={() => setShowData(true)}>view</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired
}

export default Blog