import csrf from 'csurf';

export const validateCsrf = csrf({
  cookie: {
    secure: process.env.ENV === 'prod',
    maxAge: 3600
  },
});

export const createCsrf = (req, res, next) => {
  res.cookie('x-csrf-token', req.csrfToken());
  next();
};
