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
      const errors = res.json.getCall(0).args[0].errors;
      expect(errors).to.be.an('array');
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

  describe('register', function() {
    it('should return a failure if email is invalid', function() {
      // setup
      const User = {
        save: sinon.spy()
      };
      const req = {
        body: {
          email: 'bademail',
          password: 'Good_password_1',
          passwordConfirmation: 'Good_password_1'
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      // act
      const authController = authControllerFactory(User);
      authController.register(req, res);

      // assert
      const errors = res.json.getCall(0).args[0].errors;
      expect(errors).to.be.an('array');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.contain('email');
      expect(res.status.calledWith(400)).to.equal(true);
      expect(User.save.called).not.to.be.true;
    });

    it('should return a failure if password is invalid', function() {
      // setup
      const User = {
        save: sinon.spy()
      };
      const req = {
        body: {
          email: 'goodemail@example.com',
          password: '2short',
          passwordConfirmation: '2short'
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      // act
      const authController = authControllerFactory(User);
      authController.register(req, res);

      // assert
      const errors = res.json.getCall(0).args[0].errors;
      expect(errors).to.be.an('array');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.contain('password');
      expect(res.status.calledWith(400)).to.equal(true);
      expect(User.save.called).not.to.be.true;
    });

    it('should return a failure if passwords do not match', function() {
      // setup
      const User = {
        save: sinon.spy()
      };
      const req = {
        body: {
          email: 'goodemail@example.com',
          password: 'Good_password_1',
          passwordConfirmation: 'Good_password_2'
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      // act
      const authController = authControllerFactory(User);
      authController.register(req, res);

      // assert
      const errors = res.json.getCall(0).args[0].errors;
      expect(errors).to.be.an('array');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.contain('match');
      expect(res.status.calledWith(400)).to.equal(true);
      expect(User.save.called).not.to.be.true;
    });

    it('should return a failures for both invalid email and password', function() {
      // setup
      const User = {
        save: sinon.spy()
      };
      const req = {
        body: {
          email: 'bademail',
          password: 'Missing_a_NumberInPassword',
          passwordConfirmation: 'Missing_a_NumberInPassword'
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      // act
      const authController = authControllerFactory(User);
      authController.register(req, res);

      // assert
      const errors = res.json.getCall(0).args[0].errors;
      expect(errors).to.be.an('array');
      expect(errors).to.have.lengthOf(2);
      expect(errors[0]).to.contain('email');
      expect(errors[1]).to.contain('password');
      expect(res.status.calledWith(400)).to.equal(true);
      expect(User.save.called).not.to.be.true;
    });

    it('should return a success for a good email/password combo', function() {
      // setup
      const User = {
        save: function(req, cb) {
          cb(null, {
            email: 'realuser@example.com',
            password: 'Has_1_Number_and_$ymbol',
            id: 999

          });
        }
      };
      const req = {
        body: {
          email: 'realuser@example.com',
          password: 'Asdf123!',
          passwordConfirmation: 'Asdf123!'
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      // act
      const authController = authControllerFactory(User);
      authController.register(req, res);

      // assert
      // expect(User.save.called).to.be.true;
      const success = res.json.getCall(0).args[0].success;
      expect(success).to.be.true;
      const returnedUser = res.json.getCall(0).args[0].user;
      expect(returnedUser.id).to.equal(999);
    });
  });
});