import fs from 'fs';
import { Config } from '@logzio-node-toolbox/config';
import { globalSchema } from './sharedConfig.js';
const configPath = `${process.cwd()}/src/config`;

let configFile;

if (process.env.CONFIG_FILE) {
  if (fs.existsSync(process.env.CONFIG_FILE)) {
    configFile = process.env.CONFIG_FILE;
  } else {
    throw new Error(`CONFIG_FILE ${process.env.CONFIG_FILE} not exist`);
  }
} else if (fs.existsSync(`${configPath}.js`)) {
  configFile = `${configPath}.js`;
} else if (fs.existsSync(`${configPath}.cjs`)) {
  configFile = `${configPath}.cjs`;
} else {
  throw new Error('no config file found');
}

const { schema } = await import(configFile);

export const config = new Config(globalSchema.concat(schema));


