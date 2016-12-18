import express from 'express';
import jwt from 'jsonwebtoken';

import authControllerFactory from '../controllers/authController';

const routes = function(User) {
  const authRouter = express.Router();
  const authController = authControllerFactory(User, jwt);

  authRouter.route('/signin')
    .post(authController.signIn);

  authRouter.route('/register')
    .post(authController.register);

  return authRouter;
};

export default routes;
