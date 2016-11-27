import express from 'express';

const routes = function(Recipe) {
  const recipeRouter = express.Router();

  recipeRouter.get('/', function (req, res) {
    const recipes = Recipe.find();

    res.json(recipes);
  });

  recipeRouter.get('/:recipeId', function (req, res) {
    const recipe = Recipe.findById(req.params.recipeId);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404);
      res.send({ error: 'No recipe found '});
    }
  });

  return recipeRouter;
}

export default routes;
