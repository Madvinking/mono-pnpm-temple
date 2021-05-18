import { api } from './api.js';
import { dateResolver } from '@mono-pnpm-temple-pkg/toolbox';

const Query = {
  users: () => api.getAll(),
  user: (p, { _id = null } = {}, context) => {
    console.log('context: ', context);

    return api.getData(context?.user?._id || _id);
  },
};

export const resolvers = {
  Date: dateResolver,
  Query,
  // Mutation,
};
