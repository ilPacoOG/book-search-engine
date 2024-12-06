//taken directly from the module 18 activity 26 and modified to fit the needs of the project

import User from '../models/User.js';
import Book from '../models/Book.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { searchGoogleBooks, saveBook, removeBook } from '../utils/book.js';

// Define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface BookArgs {
  bookId: string;
}

interface SaveBookArgs {
  input: {
    bookId: string;
    title: string;
    authors: [string];
  };
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('savedBooks');
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('savedBooks');
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
    searchBooks: async (_parent: any, { query }: { query: string }) => {
      return searchGoogleBooks(query);
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await saveBook(context.user, input);
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await removeBook(context.user, bookId);
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;