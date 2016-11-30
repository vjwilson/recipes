const recipeController = function(Recipe) {
  const get = function(req, res) {
    Recipe.find(function(err, result) {
      if (err) {
        res.status(500);
        res.send({ error: 'Database error'});
      } else {
        res.json(result);
      }
    });
  };
  const post = function(req, res) {
    Recipe.save(req.body, function(err, result) {
      if (err) {
        res.status(500);
        res.send({ error: 'Database error'});
      } else {
        res.status(201);
        res.json(result);
      }
    });
  };

  const findRecipe = function(req, res, next) {
    Recipe.findById(req.params.recipeId, function(err, result) {
      if (err) {
        res.status(500);
        res.send({ error: 'Database error'});
      } else if (result) {
        req.recipe = result;
        next();
      } else {
        res.status(404);
        res.send({ error: 'No recipe found '});
      }
    });
  };

  const getById = function(req, res) {
    res.json(req.recipe);
  };

  const remove = function(req, res) {
    if (req.recipe && req.recipe.id == req.params.recipeId) {
      Recipe.remove(req.params.recipeId, function(err) {
        if (err) {
          res.status(500);
          res.send({ error: 'Database error'});
        } else {
          res.status(204);
          res.send();
        }
      });
    } else {
      res.status(404);
      res.send({ error: 'No recipe found '});
    }
  };

  return {
    findRecipe: findRecipe,
    post: post,
    get: get,
    getById: getById,
    remove: remove
  };
};

export default recipeController;
