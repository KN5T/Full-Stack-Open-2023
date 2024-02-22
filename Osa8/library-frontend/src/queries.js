import { gql } from "@apollo/client"

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const USER = gql`
  query {
    me {
      username
      id
      favoriteGenre
    }
  }
`

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const FAVORITE_GENRE = gql`
  query {
    favoriteGenre
  }
`

export const ALL_BOOKS = gql`
  query getBooks($name: String, $genre: String) {
    allBooks(author: $name, genre: $genre) {
      title
      published
      author {
        name
      }
    }
  }
`

export const RECOMMENDED_BOOKS = gql`
  query getBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author {
        name
      }
    }
  }
`

export const SET_BORNYEAR = gql`
  mutation setBornYear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        name
        born
        bookCount
      }
      genres
    }
  }
`
