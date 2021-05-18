import { Joi } from '@mono-pnpm-temple-pkg/modules';

export const schema = Joi.object({
  serviceName: Joi.string().default('app-frontend'),
  port: Joi.number().default(8081),
});
