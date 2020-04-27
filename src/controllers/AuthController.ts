import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../entity/User';
import config from '../config/config';

class AuthController {
  static createSessionToken = (userId: number, sessionId: string, duration: string) => {
    return jwt.sign({ userId, sessionId }, config.jwtSecret, { expiresIn: duration });
  };

  static createSession = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    const sessionId = uuidv4();
    const accessPayload = {
      kind: 'access',
      userId: user.id,
      sessionId: sessionId,
    };
    const refreshPayload = {
      kind: 'refresh',
      userId: user.id,
      sessionId: sessionId,
    };

    const accessToken = jwt.sign(accessPayload, config.jwtSecret, {
      expiresIn: config.accessTokenDuration,
    });
    const refreshToken = jwt.sign(refreshPayload, config.jwtSecret, {
      expiresIn: config.refreshTokenDuration,
    });

    //Send the jwt in the response
    res.send({ sessionId, accessToken, refreshToken });
  };

  static refreshSession = async (req: Request, res: Response) => {
    const sessionId: number = req.params.id;
    let { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).send();
      return;
    }

    let payload;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload = <any>jwt.verify(refreshToken, config.jwtSecret);
    } catch (error) {
      res.status(401).send();
      return;
    }

    if (payload.sessionId !== sessionId || payload.kind !== 'refresh') {
      res.status(401).send();
      return;
    }

    const accessPayload = {
      kind: 'access',
      userId: payload.userId,
      sessionId: sessionId,
    };

    const accessToken = jwt.sign(accessPayload, config.jwtSecret, {
      expiresIn: config.accessTokenDuration,
    });

    res.send({ accessToken });
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
