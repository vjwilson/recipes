import express from 'express';
import passport from 'passport';
import categoryControllerFactory from '../controllers/categoryController';

const routes = function(Category) {
  const categoryRouter = express.Router();
  const categoryController = categoryControllerFactory(Category);

  categoryRouter.route('/')
    .get(categoryController.get)
    .post(passport.authenticate('jwt', { session: false }), categoryController.post);

  categoryRouter.use('/:categoryId', categoryController.findCategory);

  categoryRouter.route('/:categoryId')
    .get(categoryController.getById)
    .patch(passport.authenticate('jwt', { session: false }), categoryController.update)
    .put(passport.authenticate('jwt', { session: false }), categoryController.replace)
    .delete(passport.authenticate('jwt', { session: false }), categoryController.remove);

  return categoryRouter;
};

export default routes;
