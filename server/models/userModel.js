import bcrypt from 'bcrypt';
import queryBuilder from '../services/queryBuilder';

const userModel = function(connectionPool) {
  const pool = connectionPool;
  const allowedParams = [
    'id',
    'email'
  ];

  const save = function(user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        cb(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          cb(err);
        }
        user.password = hash;

        const newUser = {
          email: user.email,
          password: user.password,
          admin: (user.admin) ? 't' : 'f'
        };

        pool.query('INSERT INTO users (email, password, admin) VALUES ($1, $2, $3) RETURNING id', [newUser.email, newUser.password, newUser.admin], function(err, results) {
          if (err) {
            cb(err);
          } else {
            newUser.id = results.rows[0].id;
            cb(null, newUser);
          }
        });
      });
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

  const comparePassword = function(plainPassword, hashedPassword, cb) {
    bcrypt.compare(plainPassword, hashedPassword, function(err, res) {
      if (err) {
        cb(err);
      } else if (res) {
        cb(null, res);
      } else {
        cb('Unknown authentication error.');
      }
    });
  };

  return {
    save: save,
    findOne: findOne,
    comparePassword: comparePassword
  };
};

export default userModel;
