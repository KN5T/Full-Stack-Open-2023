const commentRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')

commentRouter.post('/:id/comments', async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id)

  const comment = new Comment({
    content: request.body.comment,
    blog: blog._id
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = commentRouter
