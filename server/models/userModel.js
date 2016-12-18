import queryBuilder from '../services/queryBuilder';

const userModel = function(connectionPool) {
  const pool = connectionPool;
  const allowedParams = [
    'id',
    'email'
  ];


  const find = function(cb) {
    pool.query('SELECT * FROM users', function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, results.rows);
      }
    });
  };

  const save = function(user, cb) {
    const newUser = {
      name: user.email,
      author: user.password,
      admin: (user.admin) ? 't' : 'f'
    };

    pool.query('INSERT INTO users (email, password, admin) VALUES ($1, $2, $3) RETURNING id', [newUser.email, newUser.password, newUser.admin], function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        newUser.id = results.rows[0].id;
        cb(null, newUser);
      }
    });
  };

  const findOne = function(requestedParams, cb) {
    const { whereClause, paramList } = queryBuilder(requestedParams, allowedParams);

    const query = `SELECT * FROM users WHERE ${whereClause}`;

    pool.query(query, paramList, function(err, results) {
      if (err) {
        cb(err, null);
      } else if (results.rows.length) {
        cb(null, results.rows[0]);
      } else {
        cb(null, null);
      }
    });
  };

  const update = function(user, cb) {
    const updatedUser = Object.assign({}, user);
    updatedUser.ingredients = JSON.stringify(updatedUser.ingredients);

    pool.query('UPDATE users SET name=$1, author=$2, ingredients=$3, directions=$4 WHERE id=$5', [updatedUser.name, updatedUser.author, updatedUser.ingredients, updatedUser.directions, updatedUser.id], function(err, results) {
      if (err) {
        cb(err, null);
      } else if (results.rowCount) {
        cb(null, results.rowCount);
      } else {
        cb(null, null);
      }
    });
  };

  const remove = function(userId, cb) {
    pool.query('DELETE FROM users WHERE id=$1', [userId], function(err, results) {
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
    findOne: findOne,
    update: update,
    remove: remove
  };
};

export default userModel;
