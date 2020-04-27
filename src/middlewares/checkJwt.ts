import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers['Authorization'];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(410).send();
    } else {
      res.status(401).send();
    }

    return;
  }

  //Call the next middleware or controller
  next();
};
