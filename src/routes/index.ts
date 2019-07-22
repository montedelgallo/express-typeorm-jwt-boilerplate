import { Router, Request, Response } from 'express';
import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/', (req, res) => {
  res.send('APIs are Working');
});
routes.use('/auth', auth);
routes.use('/user', user);

export default routes;
