import { User } from './User.js';
import cryptoJS from 'crypto-js';
import { config, getDirName } from '@mono-pnpm-temple/toolbox';
import fs from 'fs';
import path from 'path';
import util from 'util';

import jwt from 'jsonwebtoken';
jwt.asyncVerify = util.promisify(jwt.verify, jwt);

const secretKey = config.get('authSecret');
const privateKey = fs.readFileSync(path.join(getDirName(import.meta.url), '../../../cert/private.key'));

export const encrypt = text => cryptoJS.AES.encrypt(text, secretKey).toString();

export const decrypt = ciphertext => {
  const bytes = cryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(cryptoJS.enc.Utf8);
};

export async function loginApi({ email: recivedEmail, password: recivedPassword }) {
  const { email, name, company, createAt, _id, password } = (await User.findOne({ email: recivedEmail })) || {};
  if (!_id) throw new Error('user not found');
  if (decrypt(recivedPassword) === password) throw new Error('worng password');
  const token = jwt.sign({ email, _id }, privateKey, { algorithm: 'RS256', expiresIn: '5d' });
  const cookie = { name: 'x-auth-token', token, config: { maxAge: 900000, httpOnly: true } };

  return {
    _id,
    name,
    email,
    company,
    createAt,
    cookie
  }
}

export async function signupApi({ name, email, password, company, phone }) {
  const createAt = new Date();
  const user = { name, password: encrypt(password), company, phone, email, createAt };
  const { _id } = await User.create(user);

  const token = jwt.sign({ email, _id }, privateKey, { algorithm: 'RS256', expiresIn: '5d' });
  const cookie = { name: 'x-auth-token', token, config: { maxAge: 900000, httpOnly: true } };

  return {
    _id,
    name,
    email,
    company,
    createAt,
    cookie
  }
}

export async function getDataApi(_id) {
  return await User.findOne({ _id });
}
