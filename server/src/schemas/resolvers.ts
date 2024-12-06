// taken from module 18, activity 26 and mofidifed

import User from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('savedBooks');
    },
    user: async (_parent: any, { username }: { username: string }) => {
      return User.findOne({ username }).populate('savedBooks');
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new Error('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: { input: { username: string; email: string; password: string } }) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.password, user.email);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Could not authenticate user.');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error('Could not authenticate user.');
      }
      const token = signToken(user.username, user.password, user.email);
      return { token, user };
    },
    saveBook: async (_parent: any, { input }: { input: { bookId: string; title: string; authors: string[] } }, context: any) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new Error('You need to be logged in!');
    },
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