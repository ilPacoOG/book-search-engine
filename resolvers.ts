import User from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new Error('Could not authenticate user.');
    },
  },
  Mutation: {
    // Register a new user
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Log in an existing user
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Could not authenticate user.');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error('Could not authenticate user.');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save a book to the user's savedBooks array
    saveBook: async (_parent: any, { bookData }: { bookData: { bookId: string; authors?: string[]; description?: string; title: string; image?: string; link?: string } }, context: any) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {
            $addToSet: { savedBooks: bookData },
          },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new Error('You need to be logged in!');
    },

    // Remove a book from the user's savedBooks array
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new Error('You need to be logged in!');
    },
  },
};

export default resolvers;
