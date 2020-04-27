import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

router.post('/sessions', AuthController.createSession);
router.put('/sessions/:id', AuthController.refreshSession);

//Change my password
router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
