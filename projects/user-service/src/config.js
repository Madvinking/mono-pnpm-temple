import { Joi } from '@mono-pnpm-temple-pkg/modules';

export const schema = Joi.object({
  serviceName: Joi.string().default('user-service'),
  port: Joi.number().default(8082),
  dataBasePasswordSecert: Joi.string().default('shhhhhhh'),
});
