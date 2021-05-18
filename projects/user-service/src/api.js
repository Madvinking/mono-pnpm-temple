import { User } from './mongoUser.js';
import { signAuth } from '@mono-pnpm-temple-pkg/toolbox';
import { encryptPassword, decryptPassword } from './crypt.js';

async function login({ email: recivedEmail, password: recivedPassword }) {
  const { email, name, company, createAt, _id, password } = (await User.findOne({ email: recivedEmail })) || {};
  if (!_id) throw new Error('user not found');
  if (decryptPassword(recivedPassword) === password) throw new Error('worng password');
  const cookie = signAuth({ email, _id });

  return {
    _id,
    name,
    email,
    company,
    createAt,
    cookie,
  };
}

async function signup({ name, email, password, company, phone }) {
  const createAt = new Date();
  const user = { name, password: encryptPassword(password), company, phone, email, createAt };
  const { _id } = await User.create(user);

  const cookie = signAuth({ email, _id });

  return {
    _id,
    name,
    email,
    company,
    createAt,
    cookie,
  };
}

async function getData(_id) {
  return await User.findOne({ _id });
}

async function getAll() {
  return await User.find({});
}

export const api = {
  getAll,
  getData,
  signup,
  login,
};
