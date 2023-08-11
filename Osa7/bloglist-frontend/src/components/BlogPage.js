import Blogs from './Blogs'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useRef } from 'react'

const BlogPage = ({ blogs, user }) => {

  const blogFormRef = useRef()

  return (
    <div>
      <Togglable buttonName="create new blog" ref={blogFormRef}>
        <BlogForm
          user={user}
          toggleVisibility={() => blogFormRef.current.toggleVisibility()}
        />
      </Togglable>
      <Blogs blogs={blogs} />
    </div>
  )
}

export default BlogPage
