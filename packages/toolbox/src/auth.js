import { jwt } from '@mono-pnpm-temple-pkg/modules';
import fs from 'fs';
import path from 'path';
import { config } from './config.js';

const privateKey = fs.readFileSync(path.join(config.get('certLocation'), 'private.key'));
const publicKey = fs.readFileSync(path.join(config.get('certLocation'), 'public.pem'));

export const validateAuth = async (req, res, next) => {
  try {
    const data = await jwt.asyncVerify(req.cookies['x-auth-token'], publicKey);
    req.headers['user-data'] = JSON.stringify({ email: data.email, _id: data._id });
    if (next) next();
  } catch (err) {
    throw new ServerError({ statusCode: 403, message: 'invalid auth token', err });
  }
};

export const signAuth = ({ email, _id }) => {
  const token = jwt.sign({ email, _id }, privateKey, { algorithm: 'RS256', expiresIn: '5d' });
  const cookie = { name: 'x-auth-token', token, config: { maxAge: 900000, httpOnly: true } };
  return cookie;
};

// TODO implement a public api token
export const validatePublicApiToken = async (req, res, next) => {
  if (req.method !== 'GET') {
    if (!req.headers['public-api-token']) throw new Error('missing public api token');
    // const data = await jwt.asyncVerify(req.headers['public-api-token'], publicKey);
    // req.headers['user-data'] = JSON.stringify({ email: data.email, _id: data._id });
  }
  next();
};
