import express from 'express';
import recipeControllerFactory from '../controllers/recipeController';

const routes = function(Recipe) {
  const recipeRouter = express.Router();
  const recipeController = recipeControllerFactory(Recipe);

  recipeRouter.route('/')
    .get(recipeController.get)
    .post(recipeController.post);

  recipeRouter.use('/:recipeId', recipeController.findRecipe);

  recipeRouter.route('/:recipeId')
    .get(recipeController.getById)
    .delete(recipeController.remove);

  return recipeRouter;
};

export default routes;
