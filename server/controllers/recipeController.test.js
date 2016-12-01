import { expect } from 'chai';
import sinon from 'sinon';
import recipeControllerFactory from './recipeController';

describe('Recipe Controller', function() {
  describe('get test', function() {
    it('should return an array from recipes', function() {
      const Recipe = {
        find: function(cb) {
          cb(null, [{}]);
        }
      };
      const req = {};
      const res = {
        json: sinon.spy()
      };

      const recipeController = recipeControllerFactory(Recipe);

      recipeController.get(req, res);

      expect(res.json.calledWith([{}])).to.equal(true);
    });
  });

  describe('post test', function() {
    it('should add a new recipe', function() {
      const recipePostData = {
        name: 'Soup',
        author: 'Chris Doe'
      };

      const Recipe = {
        save: function(recipe, cb) {
          const newRecipe = Object.assign({}, recipe);
          newRecipe.id = 999;
          cb(null, newRecipe);
        }
      };
      const req = {
        body: recipePostData
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      const recipeController = recipeControllerFactory(Recipe);

      recipeController.post(req, res);

      expect(res.status.calledWith(201)).to.equal(true);
      expect(res.json.calledWith(sinon.match.object)).to.equal(true);
    });
  });

  describe('find by ID test', function() {
    it('should find a recipe object and call the next handler', function() {
      const recipeId = 9;

      const Recipe = {
        findById: function(id, cb) {
          cb(null, { id: id });
        }
      };
      const req = {
        params: {
          recipeId: recipeId
        }
      };
      const res = {};
      const next = sinon.spy();

      const recipeController = recipeControllerFactory(Recipe);
      recipeController.findRecipe(req, res, next);

      expect(req.recipe).to.eql({ id: recipeId });
      expect(next.calledOnce).to.equal(true);
    });

    it('should return a recipe object', function() {
      const recipeId = 9;

      const Recipe = {
        findById: function() {
          return {
            id: recipeId
          };
        }
      };
      const req = {
        recipe: {
          id: recipeId
        }
      };
      const res = {
        json: sinon.spy()
      };

      const recipeController = recipeControllerFactory(Recipe);
      recipeController.getById(req, res);

      expect(res.json.calledWith(req.recipe)).to.equal(true);
    });

    it('should update a recipe object', function() {
      // setup
      const recipeId = 17;

      const originalRecipe = {
        id: recipeId,
        name: 'Hash',
        author: 'Mickey Mouse',
        ingredients: [ 'salt', 'pepper', 'milk'],
        description: 'Blah blah blah'
      };

      const Recipe = {
        update: function(id, cb) {
          cb(null, { id: id });
        }
      };
      const req = {
        body: {
          id: recipeId,
          author: 'Donald Duck'
        },
        params: {
          recipeId: recipeId
        },
        recipe: originalRecipe
      };
      const res = {
        json: sinon.spy()
      };

      const expectedRecipe = Object.assign({}, originalRecipe);
      expectedRecipe.author = req.body.author;

      // act
      const recipeController = recipeControllerFactory(Recipe);
      recipeController.update(req, res);

      // assert
      sinon.assert.calledWith(res.json, expectedRecipe);
    });

    it('should replace a recipe object', function() {

      const recipeId = 17;
      // setup
      const originalRecipe = {
        id: recipeId,
        name: 'Hash',
        author: 'Mickey Mouse',
        ingredients: [ 'salt', 'pepper', 'milk'],
        directions: 'Blah blah blah'
      };

      const Recipe = {
        update: function(id, cb) {
          cb(null, { id: id });
        }
      };
      const req = {
        body: {
          id: recipeId,
          name: 'Stew',
          author: 'Donald Duck',
          ingredients: ['broth', 'carrots'],
          directions: 'Etc. etc. etc.'
        },
        params: {
          recipeId: recipeId
        },
        recipe: originalRecipe
      };
      const res = {
        json: sinon.spy()
      };

      const expectedRecipe = Object.assign({}, req.body);

      // act
      const recipeController = recipeControllerFactory(Recipe);
      recipeController.replace(req, res);

      // assert
      sinon.assert.calledWith(res.json, expectedRecipe);
    });
  });

  describe('delete by ID test', function() {
    it('should delete a recipe object', function() {
      const recipeId = 19;

      const Recipe = {
        remove: function(id, cb) {
          cb(null, id );
        }
      };
      const req = {
        params: {
          recipeId: recipeId
        },
        recipe: {
          id: recipeId
        }
      };
      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };

      const recipeController = recipeControllerFactory(Recipe);
      recipeController.remove(req, res);

      expect(res.status.calledWith(204)).to.equal(true);
      expect(res.send.calledOnce).to.equal(true);
    });
  });
});