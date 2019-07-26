import { Router, Request, Response } from 'express';
import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/', (req: Request, res: Response) => {
  return res.send('APIs are Working');
});
routes.use('/auth', auth);
routes.use('/user', user);

export default routes;
