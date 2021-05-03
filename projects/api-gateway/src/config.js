import Joi from 'joi';

export const schema = Joi.object({
  serviceName: Joi.string().default('api-gateway'),
  port: Joi.number().default(8080),
  appStaticRoutes: Joi.boolean().default(false),
  appFolder: Joi.string().default('svelte-app')
});
