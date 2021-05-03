
import jwt from 'jsonwebtoken';
import util from 'util';
import fs from 'fs';
import path from 'path';

import { getDirName } from '@mono-pnpm-temple/toolbox';
jwt.asyncVerify = util.promisify(jwt.verify, jwt);

const publicKey = fs.readFileSync(path.join(getDirName(import.meta.url), '../../../../cert/public.pem'));

export const validateAuth = async (req, res, next) => {
  try {
    const data = await jwt.asyncVerify(req.cookies['x-auth-token'], publicKey);
    req.user = { email: data.email, id: data.id };
    next();
  } catch (err) {
    res.redirect('/');
    // throw new ServerError({ statusCode: 403, message: 'invalid auth token', err });
  }
};
