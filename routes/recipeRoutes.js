import express from 'express';
import recipeControllerFactory from '../controllers/recipeController';

const routes = function(Recipe) {
  const recipeRouter = express.Router();
  const recipeController = recipeControllerFactory(Recipe);

  recipeRouter.route('/')
    .get(recipeController.get);

  recipeRouter.use('/:recipeId', recipeController.findRecipe);

  recipeRouter.route('/:recipeId')
    .get(recipeController.getById);

  return recipeRouter;
}

export default routes;
