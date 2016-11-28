const recipeController = function(Recipe) {
  const get = function(req, res) {
    const recipes = Recipe.find();

    res.json(recipes);
  };

  const findRecipe = function(req, res, next) {
    const recipe = Recipe.findById(req.params.recipeId);
    if (recipe) {
      req.recipe = recipe;
      next();
    } else {
      res.status(404);
      res.send({ error: 'No recipe found '});
    }
  };

  const getById = function(req, res) {
    res.json(req.recipe);
  };

  return {
    findRecipe: findRecipe,
    get: get,
    getById: getById
  }
};

export default recipeController;
