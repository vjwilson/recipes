import queryBuilder from '../services/queryBuilder';

const recipeModel = function(connectionPool) {
  const pool = connectionPool;

  const find = function(queryParams, cb) {
    let whereClause;
    let paramList;

    if (queryParams &&
        Object.keys(queryParams) &&
        Object.keys(queryParams).length) {
      const allowedParams = [
        'name',
        'author'
      ];
      const fuzzyMatch = true;
      ({ whereClause, paramList } = queryBuilder(queryParams, allowedParams, fuzzyMatch));
    } else {
      whereClause = '1=$1';
      paramList = [1];
    }

    const query = `SELECT r.*, array_remove(array_agg(rc.category_id), NULL) AS category_ids FROM recipes r LEFT OUTER JOIN recipes_categories rc ON r.id=rc.recipe_id WHERE ${whereClause} GROUP BY r.id ORDER BY r.id`;
    pool.query(query, paramList, function(err, results) {
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

  const update = function(recipe, cb) {
    const updatedRecipe = Object.assign({}, recipe);
    updatedRecipe.ingredients = JSON.stringify(updatedRecipe.ingredients);

    pool.query('UPDATE recipes SET name=$1, author=$2, ingredients=$3, directions=$4 WHERE id=$5', [updatedRecipe.name, updatedRecipe.author, updatedRecipe.ingredients, updatedRecipe.directions, updatedRecipe.id], function(err, results) {
      if (err) {
        cb(err, null);
      } else if (results.rowCount) {
        cb(null, results.rowCount);
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
    update: update,
    remove: remove
  };
};

export default recipeModel;
