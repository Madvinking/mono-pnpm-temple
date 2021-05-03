import Joi from 'joi';

export const schema = Joi.object({
  serviceName: Joi.string().default('service-example'),
  port: Joi.number().default(8081),
  authSecret: Joi.string().default('shhhhhhh'),
});
