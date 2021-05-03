import { User } from './User.js';
import { resolvers as globalResolvers } from '@mono-pnpm-temple/toolbox';

const Query = {
  users: () => User.find(),
  user: (p, { id }, context) => {
    console.log('context: ', context);
    return User.findById(id);
  },
};

const Mutation = {
  signup: async (p, { singupInput }) => {
    // TODO xss all arguments
    return await User.create(singupInput);
  },

  login: async (p, { loginInput }) => {
    return await User.findOne(loginInput);
  },
  update: async (p, { updateInput: { id, ...updateData } }) => {
    const { _id, ...data } = await User.findByIdAndUpdate(id, updateData, { lean: true, new: true });
    return { id: _id, ...data };
  },
};

export const resolvers = {
  Date: globalResolvers.Date,
  Query,
  Mutation,
};
