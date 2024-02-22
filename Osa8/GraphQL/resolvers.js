const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")

const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    me: (_, __, { currentUser }) => currentUser,
    favoriteGenre: (_, __, { currentUser }) => currentUser.favoriteGenre,
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (_, { author, genre }) => {
      if (!author && !genre) {
        return Book.find({})
      } else if (author && !genre) {
        const authorObj = await Author.findOne({ name: author })
        return Book.find({ author: authorObj })
      } else if (!author && genre) {
        return Book.find({ genres: { $eq: genre } })
      } else {
        const authorObj = await Author.findOne({ name: author })
        return Book.find({ genres: { $eq: genre }, author: authorObj })
      }
    },
    allAuthors: async () => await Author.find({}),
    allGenres: async () => {
      const books = await Book.find({})

      const genres = books.reduce((accumalator, book) => {
        const newGenres = book.genres.filter(
          (genre) => !accumalator.includes(genre)
        )
        return accumalator.concat(newGenres)
      }, [])

      return genres
    },
  },
  Author: {
    bookCount: async (root) => {
      const currentAuthor = await Author.find({ name: root.name })
      const books = await Book.find({ author: currentAuthor[0]._id })
      return books.length
    },
  },
  Book: {
    author: async (root) => {
      return Author.findById(root.author)
    },
  },
  Mutation: {
    createUser: async (_, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: { username, favoriteGenre },
            error,
          },
        })
      })
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username })

      if (!user || password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: { username, password },
          },
        })
      }

      const userForToken = { username, id: user._id }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        try {
          author = new Author({ name: args.author })
          await author.save()
        } catch (error) {
          throw new GraphQLError("invalid author", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          })
        }
      }

      const newBook = new Book({ ...args, author: author })

      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError("adding book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook })

      return newBook
    },
    editAuthor: async (_, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const author = await Author.findOne({ name })
      if (!author) return null

      author.born = setBornTo
      const savedAuthor = await author.save()
      return savedAuthor
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
}

module.exports = resolvers
