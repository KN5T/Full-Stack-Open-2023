var _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, currentBlog) => {
    return currentBlog.likes + sum
  }, 0)

  return blogs.lenght === 0 ? 0 : total
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((favorite, current) => {
    return current.likes >= favorite.likes ? current : favorite
  }, { likes: 0 })

  return blogs.length === 0
    ? {}
    : {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes,
    }
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) return {}

  const authors =_.reduce(blogs, (result, blog) => {
    result[blog.author]
      ? (result[blog.author].blogs += 1)
      : result[blog.author] = { author: blog.author, blogs: 1 }
    return result
  }, [])

  const authorWithMostBlogs = _.maxBy(_.keys(authors), (author) => authors[author].blogs)
  return authors[authorWithMostBlogs]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authors = _.reduce(blogs,(result, blog) => {
    result[blog.author]
      ? (result[blog.author].likes += blog.likes)
      : (result[blog.author] = { author: blog.author, likes: blog.likes })
    return result
  }, [])

  const authorWithMostLikes = _.maxBy(_.keys(authors), (author) => authors[author].likes)
  return authors[authorWithMostLikes]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
