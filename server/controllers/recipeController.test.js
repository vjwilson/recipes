import { expect } from 'chai';
import sinon from 'sinon';
import recipeControllerFactory from './recipeController';

describe('Recipe Controller', function() {
  describe('get test', function() {
    it('should return an array from recipes', function() {
      const Recipe = {
        find: function() {
          return [{}];
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

  describe('find by ID test', function() {
    it('should find a recipe object and call the next handler', function() {
      const recipeId = 9;

      const Recipe = {
        findById: function() {
          return {
            id: recipeId
          };
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

    it('should return a recipe object and call the next handler', function() {
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
  });
});