var recipeModel = function() {
  var recipes = require('./recipeData');

  var find = function() {
    return recipes;
  }

  var findById = function(id) {
    var selectedRecipe = recipes.filter(function(recipe) {
      return recipe.id == this;
    }, id);

    return selectedRecipe[0];
  }

  return {
    find: find,
    findById: findById
  }
}

module.exports = recipeModel;
