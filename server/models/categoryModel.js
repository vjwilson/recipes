import queryBuilder from '../services/queryBuilder';

const categoryModel = function(connectionPool) {
  const pool = connectionPool;

  const find = function(queryParams, cb) {
    let whereClause;
    let paramList;

    if (queryParams &&
        Object.keys(queryParams) &&
        Object.keys(queryParams).length) {
      const allowedParams = [
        'name',
        'description'
      ];
      const fuzzyMatch = true;
      ({ whereClause, paramList } = queryBuilder(queryParams, allowedParams, fuzzyMatch));
    } else {
      whereClause = '1=$1';
      paramList = [1];
    }

    const query = `SELECT * FROM categories WHERE ${whereClause} ORDER BY id`;
    pool.query(query, paramList, function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, results.rows);
      }
    });
  };

  const save = function(category, cb) {
    const newCategory = {
      name: category.name,
      description: category.description
    };
    pool.query('INSERT INTO categories (name, description) VALUES ($1, $2, $3, $4) RETURNING id', [newCategory.name, newCategory.description], function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        newCategory.id = results.rows[0].id;
        cb(null, newCategory);
      }
    });
  };

  const findById = function(categoryId, cb) {
    pool.query('SELECT * FROM categories WHERE id=$1', [categoryId], function(err, results) {
      if (err) {
        cb(err, null);
      } else if (results.rows.length) {
        cb(null, results.rows[0]);
      } else {
        cb(null, null);
      }
    });
  };

  const update = function(category, cb) {
    const updatedCategory = Object.assign({}, category);

    pool.query('UPDATE categories SET name=$1, description=$2 WHERE id=$3', [updatedCategory.name, updatedCategory.description, updatedCategory.id], function(err, results) {
      if (err) {
        cb(err, null);
      } else if (results.rowCount) {
        cb(null, results.rowCount);
      } else {
        cb(null, null);
      }
    });
  };

  const remove = function(categoryId, cb) {
    pool.query('DELETE FROM categories WHERE id=$1', [categoryId], function(err, results) {
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

export default categoryModel;
