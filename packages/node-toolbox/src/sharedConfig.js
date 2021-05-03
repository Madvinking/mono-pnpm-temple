import dotenv from 'dotenv'
dotenv.config()

import os from 'os';
import Joi from 'joi';
import ip from 'ip';
import path from 'path';
import { require } from './utils/require.js';
import { getDirName } from './utils/dirname.js'

const { version } = require(path.join(getDirName(import.meta.url), './version.json'));

const defaultEnv = process.env.ENV ? process.env.ENV.toLowerCase() : 'local';

const env = {
  REGION: process.env.REGION ? process.env.REGION.toLowerCase() : null,
  ENV: defaultEnv,
  HOSTNAME: process.env.HOSTNAME || os.hostname(),
  CONSUL_HOST: process.env.CONSUL_HOST || '127.0.0.1',
  CONSUL_PORT: process.env.CONSUL_HOST || 18500,
  JAEGER_AGENT_HOST: process.env.JAEGER_AGENT_HOST || 'localhost',
};

export const globalSchema = Joi.object({
  region: Joi.string().allow(null).default(env.REGION),
  environment: Joi.string().default(env.ENV),
  ip: Joi.string().ip().default(ip.address()),
  hostname: Joi.string().default(env.HOSTNAME),
  version: Joi.string().default(version),
  mongodb: Joi.object({
    host: Joi.string().default('localhost'),
    port: Joi.string().default('27017'),
    database: Joi.string().default('database'),
    user: Joi.string().default('user'),
    password: Joi.string().default('password'),
    options: Joi.object({
      useNewUrlParser: Joi.boolean().default(true),
      useUnifiedTopology: Joi.boolean().default(true),
      useCreateIndex: Joi.boolean().default(true),
      useFindAndModify: Joi.boolean().default(false),
    }).default(),
  }).default(),
  services: Joi.array()
    .default([
      {
        name: 'user',
        url: 'http://localhost:8081',
        supportGraphql: true,
        endpoints: ['/user/*'],
        skipAuth: ['/user/login', '/user/signup'],
      },
      {
        name: 'frontend',
        url: 'http://localhost:8181',
        supportGraphql: false,
        endpoints: ['/', '/app/*', '/login', '/signup'],
        skipAuth: ['/', '/app', '/login', '/signup', '/favicon.ico'],
      }
    ]),
  consul: Joi.object({
    host: Joi.string().default(env.CONSUL_HOST),
    port: Joi.number().default(env.CONSUL_PORT),
    env: Joi.string().default(env.ENV),
    baseUrl: Joi.string().default('configurations'),
    validate: Joi.object({
      fail: Joi.boolean().default(true),
      timeout: Joi.number().default(30000),
    }).default(),
    watch: Joi.object({
      backoffMax: Joi.number().default(3000),
      backoffFactor: Joi.number().default(500),
    }).default(),
  }).default(),
  internalIps: Joi.array()
    .items(Joi.string().ip())
    .default(['127.0.0.1/8', '172.0.0.0/16', '192.168.0.0/8', '10.0.0.0/24']),
  tracer: Joi.object({
    active: Joi.boolean().default(true),
    probability: Joi.number().default(1),
    host: Joi.string().default(env.JAEGER_AGENT_HOST),
    port: Joi.number().default(6832),
    excludedPaths: Joi.array().items(Joi.string()).default(['^/$', '/favicon.ico']),
  }).default(),
  logger: Joi.object({
    token: Joi.string().allow(null).default(null),
    debug: Joi.boolean().default(false),
    logToConsole: Joi.boolean().default(true),
    color: Joi.boolean().default(true),
  }).default(),
  server: Joi.object({
    gracefulShutdown: Joi.object({
      delay: Joi.number().default(0),
      serverStopTimeout: Joi.number().default(0),
    }).default(),
    timeout: Joi.object({
      socket: Joi.number().default(5 * 60 * 1000 + 1),
      keepAlive: Joi.number().default(90 * 1000),
      headers: Joi.number().default(90 * 1000 + 2),
    }).default(),
  }).default(),
  routesDescriptor: Joi.object({}).default(),
  serviceDiscovery: Joi.object({
    active: Joi.boolean().default(true),
    disableHealthChecks: Joi.boolean().default(false),
    deregisterCriticalServiceAfter: Joi.string().default('6h'),
    apiGatewayConnectTimeoutMs: Joi.number().default(30 * 1000),
    apiGatewayReadTimeoutMs: Joi.number().default(5 * 60 * 1000),
    registerInterval: Joi.number().default(5 * 60 * 1000),
  }).default(),
  healthChecks: Joi.object({
    liveness: Joi.object({
      path: Joi.string().default('/admin/liveness'),
      interval: Joi.number().default(30),
    }).default(),
    readiness: Joi.object({
      path: Joi.string().default('/admin/readiness'),
      interval: Joi.number().default(5),
    }).default(),
  }).default()
});

