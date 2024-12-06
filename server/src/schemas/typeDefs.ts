//taken from module 18, activity 26 and modified

import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String!]!
    description: String!
    title: String!
    image: String!
    link: String
  }

  type Auth {
    token: String!
    user: User
  }

  type Query {
    # Fetch all users
    users: [User]
    # Fetch a user by username
    user(username: String!): User
    # Fetch the current authenticated user's information
    me: User
  }

  type Mutation {
    # Authenticate user with email and password
    login(email: String!, password: String!): Auth

    # Register a new user with username, email, and password
    addUser(username: String!, email: String!, password: String!): Auth

    # Save a book to the user's list of saved books
    saveBook(bookId: ID!, authors: [String]!, description: String!, title: String!, image: String!, link: String): User

    # Remove a book from the user's list of saved books
    removeBook(bookId: ID!): User
  }
`;

export default typeDefs;