const categoryController = function(Category) {
  const get = function(req, res) {
    const queryParams = req.query;
    Category.find(queryParams, function(err, result) {
      if (err) {
        res.status(500);
        res.send({ error: 'Database error'});
      } else {
        res.json(result);
      }
    });
  };
  const post = function(req, res) {
    Category.save(req.body, function(err, result) {
      if (err) {
        res.status(500);
        res.send({ error: 'Database error'});
      } else {
        res.status(201);
        res.json(result);
      }
    });
  };

  const findCategory = function(req, res, next) {
    Category.findById(req.params.categoryId, function(err, result) {
      if (err) {
        res.status(500);
        res.send({ error: 'Database error'});
      } else if (result) {
        req.category = result;
        next();
      } else {
        res.status(404);
        res.send({ error: 'No category found '});
      }
    });
  };

  const getById = function(req, res) {
    res.json(req.category);
  };

  const update = function(req, res) {
    delete req.body.id; // guard against getting ID out-of-sync

    req.category = Object.assign(req.category, req.body);

    Category.update(req.category, function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.category);
      }
    });
  };

  const replace = function(req, res) {
    req.category.name = req.body.name;
    req.category.description = req.body.description;

    Category.update(req.category, function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.category);
      }
    });
  };

  const remove = function(req, res) {
    if (req.category && req.category.id == req.params.categoryId) {
      Category.remove(req.params.categoryId, function(err) {
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
      res.send({ error: 'No category found '});
    }
  };

  return {
    findCategory: findCategory,
    post: post,
    get: get,
    getById: getById,
    update: update,
    replace: replace,
    remove: remove
  };
};

export default categoryController;
