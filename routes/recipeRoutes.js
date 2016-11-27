var express = require('express');

var routes = function(Recipe) {
  var recipeRouter = express.Router();

  recipeRouter.get('/', function (req, res) {
    var recipes = Recipe.find();

    res.json(recipes);
  });

  recipeRouter.get('/:recipeId', function (req, res) {
    var recipe = Recipe.findById(req.params.recipeId);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404);
      res.send({ error: 'No recipe found '});
    }
  });

  return recipeRouter;
}

module.exports = routes;
