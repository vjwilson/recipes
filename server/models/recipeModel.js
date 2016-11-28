import recipes from './recipeData';

const recipeModel = function() {

  const find = function() {
    return recipes;
  }

  const findById = function(recipeId) {
    const selectedRecipe = recipes.find((recipe) => {
      return recipe.id == recipeId;
    });

    return selectedRecipe;
  }

  return {
    find: find,
    findById: findById
  }
}

export default recipeModel;
