import { expect } from 'chai';
import sinon from 'sinon';
import authControllerFactory from './authController';

describe('Auth Controller', function() {
  describe('signIn', function() {
    it('should return a failure for a bad email/password combo', function() {
      // setup
      const User = {
        findOne: function(req, cb) {
          cb(null, [{}]);
        }
      };
      const req = {
        body: {
          email: 'realuser@example.com',
          password: 'badPassword'
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      // act
      const authController = authControllerFactory(User);
      authController.signIn(req, res);

      // assert
      const message = res.json.getCall(0).args[0].message;
      expect(message).to.be.a('string');
      expect(res.status.calledWith(401)).to.equal(true);
    });

    it('should return a success for a good email/password combo', function() {
      // setup
      const User = {
        findOne: function(req, cb) {
          cb(null, {
            email: 'realuser@example.com',
            password: 'goodPassword'
          });
        }
      };
      const req = {
        body: {
          email: 'realuser@example.com',
          password: 'goodPassword'
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      // act
      const authController = authControllerFactory(User);
      authController.signIn(req, res);

      // assert
      const success = res.json.getCall(0).args[0].success;
      expect(success).to.be.true;
    });
  });
});