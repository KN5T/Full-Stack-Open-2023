const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const {
  initialBlogs,
  blogsInDB,
  usersInDB,
  getToken,
} = require('../tests/test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    await Blog.deleteMany({})
    const users = await usersInDB()
    initialBlogs[0].user = users[0].id
    initialBlogs[1].user = users[0].id
    await Blog.insertMany(initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('the name of the identifying field is id', async () => {
    const blogs = await blogsInDB()

    expect(blogs[0].id).toBeDefined()
  })

  describe('addition of a new blog', () => {

    test('creation fails with statuscode 401 if the request does not contain a token', async () => {
      const users = await usersInDB()
      const userId = users[0].id

      const newBlog = {
        title: 'New blog',
        author: 'Unknown',
        url: 'http://addBlog',
        likes: 2,
        user: userId
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      expect(result.body.error).toContain('token missing')
    })

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'New blog',
        author: 'Unknown',
        url: 'http://addBlog',
        likes: 2,
      }

      const token = await getToken()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDB()

      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      expect(titles).toContain('New blog')
    })

    test('value of empty likes field is 0', async () => {
      await Blog.deleteMany({})

      const newBlog = {
        title: 'No like field',
        author: 'Unknown',
        url: 'http://NoLikeField',
      }

      const token = await getToken()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)

      const blogsAtEnd = await blogsInDB()
      expect(blogsAtEnd[0].likes).toBe(0)
    })

    test('blog without title is not added', async () => {
      const blog = {
        author: 'Unknown',
        url: 'http://emptyTitle',
        likes: 22,
      }

      const token = await getToken()

      await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(blog)
        .expect(400)

      const blogsAtEnd = await blogsInDB()
      expect(initialBlogs.length).toBe(blogsAtEnd.length)
    })

    test('blog without author is not added', async () => {
      const blog = {
        title: 'Empty author',
        url: 'http://emptyAuthor',
        likes: 1,
      }

      const token = await getToken()
      await api.post('/api/blogs').send(blog).set({ Authorization: `Bearer ${token}` }).expect(400)

      const blogsAtEnd = await blogsInDB()
      expect(initialBlogs.length).toBe(blogsAtEnd.length)
    })
  })

  describe('deletion of a blog', () => {
    test('blog with valid id can be deleted', async () => {
      const blogsAtStart = await blogsInDB()
      const blogToDelete = blogsAtStart[0]

      const token = await getToken()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(204)

      const blogsAtEnd = await blogsInDB()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('updating a blog', () => {
    test('blog with valid id can be updated', async () => {
      const blogsAtStart = await blogsInDB()
      const blogToUpdate = {
        title: blogsAtStart[0].title,
        author: blogsAtStart[0].author,
        url: blogsAtStart[0].url,
        likes: 40,
      }

      await api.put(`/api/blogs/${blogsAtStart[0].id}`).send(blogToUpdate)

      const blogsAtEnd = await blogsInDB()

      expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes)
    })
  })
})

describe('when there is initially one user at the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('addition of user', () => {
    test('valid unique user can be added', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'testUser',
        name: 'test',
        password: 'password',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map((user) => user.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with statuscode 400 and message if username already taken', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'root',
        name: 'test',
        password: 'password',
      }

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with statuscode 400 and message if username is shorter than 3 characters', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'ro',
        name: 'test',
        password: 'password',
      }

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain(
        'is shorter than the minimum allowed length (3)'
      )

      const usersAtEnd = await usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with statuscode 400 and message if password is shorter than 3 characters', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'root',
        name: 'test',
        password: 'pa',
      }

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain(
        'is shorter than the minimum allowed length (3)'
      )

      const usersAtEnd = await usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with statuscode 400 and message if username is not given', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        name: 'test',
        password: 'password',
      }

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain('Path `username` is required')

      const usersAtEnd = await usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with statuscode 400 and message if password is not given', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'root',
        name: 'test',
      }

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain('Password is required')

      const usersAtEnd = await usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
