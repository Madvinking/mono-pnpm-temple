import cryptoJS from 'crypto-js';
import { config } from '@mono-pnpm-temple-pkg/toolbox';

const secretKey = config.get('dataBasePasswordSecert');

export const encryptPassword = text => cryptoJS.AES.encrypt(text, secretKey).toString();

export const decryptPassword = ciphertext => {
  const bytes = cryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(cryptoJS.enc.Utf8);
};
