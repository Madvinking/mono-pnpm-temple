import { api } from './api.js';

export function crud(app) {
  app.post('/user/signup', async (req, res) => {
    try {
      const { name, password, company, phone, email } = req.body;
      const { createdAt, _id, cookie } = await api.signup({ name, password, company, phone, email });

      res.cookie(cookie.name, cookie.token, cookie.config);
      res.json({ name, _id, createdAt, company, phone, email });
    } catch (err) {
      throw new ServerError({ message: 'faild to signup', statusCode: 401, err });
    }
  });

  app.post('/user/login', async (req, res) => {
    try {
      let { email, password } = req.body;
      const { cookie, name, company, createAt, _id } = await api.login({ email, password });
      res.cookie(cookie.name, cookie.token, cookie.config);
      res.json({ email, name, company, createAt, _id });
    } catch (err) {
      throw new ServerError({ message: 'faild to login with', statusCode: 401, err });
    }
  });

  app.get('/user/getData', async (req, res) => {
    try {
      const { _id, email } = JSON.parse(req.headers['user-data']);
      const { name, company, createAt } = await api.getData({ _id });
      res.json({ email, name, company, createAt, _id });
    } catch (err) {
      throw new ServerError({ message: 'faild to get user data with', statusCode: 401, err });
    }
  });

  app.post('/user/logout', async (req, res) => {
    res.cookie('x-auth-token', '', { maxAge: 0 });
    res.json({});
  });
}
