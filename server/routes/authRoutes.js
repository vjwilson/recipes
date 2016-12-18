import express from 'express';
import authControllerFactory from '../controllers/authController';

const routes = function(User) {
  const authRouter = express.Router();
  const authController = authControllerFactory(User);

  authRouter.route('/signin')
    .post(authController.signIn);

  authRouter.route('/register')
    .post(authController.register);

  return authRouter;
};

export default routes;
