// import recipes from './recipeData';

const recipeModel = function(connectionPool) {
  const pool = connectionPool;

  const find = function(cb) {
    pool.query('SELECT * FROM recipes', function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, results.rows);
      }
    });
  };

  const save = function(recipe, cb) {
    const newRecipe = {
      name: recipe.name,
      author: recipe.author,
      ingredients: JSON.stringify(recipe.ingredients),
      directions: recipe.directions
    };
    pool.query('INSERT INTO recipes (name, author, ingredients, directions) VALUES ($1, $2, $3, $4) RETURNING id', [newRecipe.name, newRecipe.author, newRecipe.ingredients, newRecipe.directions], function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        newRecipe.id = results.rows[0].id;
        cb(null, newRecipe);
      }
    });
  };

  const findById = function(recipeId, cb) {
    pool.query('SELECT * FROM recipes WHERE id=$1', [recipeId], function(err, results) {
      if (err) {
        cb(err, null);
      } else if (results.rows.length) {
        cb(null, results.rows[0]);
      } else {
        cb(null, null);
      }
    });
  };

  const remove = function(recipeId, cb) {
    pool.query('DELETE FROM recipes WHERE id=$1', [recipeId], function(err, results) {
      if (err) {
        cb(err, null);
      } else if (results.rowCount) {
        cb(null, results.rowCount);
      } else {
        cb(null, null);
      }
    });
  };

  return {
    find: find,
    save: save,
    findById: findById,
    remove: remove
  };
};

export default recipeModel;
