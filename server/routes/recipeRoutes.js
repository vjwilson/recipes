import express from 'express';
import passport from 'passport';
import recipeControllerFactory from '../controllers/recipeController';

const routes = function(Recipe) {
  const recipeRouter = express.Router();
  const recipeController = recipeControllerFactory(Recipe);

  recipeRouter.route('/')
    .get(recipeController.get)
    .post(passport.authenticate('jwt', { session: false }), recipeController.post);

  recipeRouter.use('/:recipeId', recipeController.findRecipe);

  recipeRouter.route('/:recipeId')
    .get(recipeController.getById)
    .patch(passport.authenticate('jwt', { session: false }), recipeController.update)
    .put(passport.authenticate('jwt', { session: false }), recipeController.replace)
    .delete(passport.authenticate('jwt', { session: false }), recipeController.remove);

  return recipeRouter;
};

export default routes;
