import { expect } from 'chai';
import sinon from 'sinon';
import categoryControllerFactory from './categoryController';

describe('Category Controller', function() {
  describe('get test', function() {
    it('should return an array from categories', function() {
      const Category = {
        find: function(queryParams, cb) {
          cb(null, [{}]);
        }
      };
      const req = {};
      const res = {
        json: sinon.spy()
      };

      const categoryController = categoryControllerFactory(Category);

      categoryController.get(req, res);

      expect(res.json.calledWith([{}])).to.equal(true);
    });
  });

  describe('post test', function() {
    it('should add a new category', function() {
      const categoryPostData = {
        name: 'Dessert',
        description: 'Sweet things to eat after dinner'
      };

      const Category = {
        save: function(category, cb) {
          const newCategory = Object.assign({}, category);
          newCategory.id = 999;
          cb(null, newCategory);
        }
      };
      const req = {
        body: categoryPostData
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      const categoryController = categoryControllerFactory(Category);

      categoryController.post(req, res);

      expect(res.status.calledWith(201)).to.equal(true);
      expect(res.json.calledWith(sinon.match.object)).to.equal(true);
    });
  });

  describe('find by ID test', function() {
    it('should find a category object and call the next handler', function() {
      const categoryId = 9;

      const Category = {
        findById: function(id, cb) {
          cb(null, { id: id });
        }
      };
      const req = {
        params: {
          categoryId: categoryId
        }
      };
      const res = {};
      const next = sinon.spy();

      const categoryController = categoryControllerFactory(Category);
      categoryController.findCategory(req, res, next);

      expect(req.category).to.eql({ id: categoryId });
      expect(next.calledOnce).to.equal(true);
    });

    it('should return a category object', function() {
      const categoryId = 9;

      const Category = {
        findById: function() {
          return {
            id: categoryId
          };
        }
      };
      const req = {
        category: {
          id: categoryId
        }
      };
      const res = {
        json: sinon.spy()
      };

      const categoryController = categoryControllerFactory(Category);
      categoryController.getById(req, res);

      expect(res.json.calledWith(req.category)).to.equal(true);
    });

    it('should update a category object', function() {
      // setup
      const categoryId = 17;

      const originalCategory = {
        id: categoryId,
        name: 'Stews',
        description: 'Savory mixtures of ingredients'
      };

      const Category = {
        update: function(id, cb) {
          cb(null, { id: id });
        }
      };
      const req = {
        body: {
          id: categoryId,
          name: 'Soups'
        },
        params: {
          categoryId: categoryId
        },
        category: originalCategory
      };
      const res = {
        json: sinon.spy()
      };

      const expectedCategory = Object.assign({}, originalCategory);
      expectedCategory.name = req.body.name;

      // act
      const categoryController = categoryControllerFactory(Category);
      categoryController.update(req, res);

      // assert
      sinon.assert.calledWith(res.json, expectedCategory);
    });

    it('should replace a category object', function() {

      const categoryId = 17;
      // setup
      const originalCategory = {
        id: categoryId,
        name: 'Stews',
        description: 'Savorys mixtures of ingredients'
      };

      const Category = {
        update: function(id, cb) {
          cb(null, { id: id });
        }
      };
      const req = {
        body: {
          id: categoryId,
          name: 'Soups',
          description: 'Savory mixtures of ingredients'
        },
        params: {
          categoryId: categoryId
        },
        category: originalCategory
      };
      const res = {
        json: sinon.spy()
      };

      const expectedCategory = Object.assign({}, req.body);

      // act
      const categoryController = categoryControllerFactory(Category);
      categoryController.replace(req, res);

      // assert
      sinon.assert.calledWith(res.json, expectedCategory);
    });
  });

  describe('delete by ID test', function() {
    it('should delete a category object', function() {
      const categoryId = 19;

      const Category = {
        remove: function(id, cb) {
          cb(null, id );
        }
      };
      const req = {
        params: {
          categoryId: categoryId
        },
        category: {
          id: categoryId
        }
      };
      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };

      const categoryController = categoryControllerFactory(Category);
      categoryController.remove(req, res);

      expect(res.status.calledWith(204)).to.equal(true);
      expect(res.send.calledOnce).to.equal(true);
    });
  });
});