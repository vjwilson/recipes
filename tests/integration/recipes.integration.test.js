var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app = require('../../server');

var agent = request.agent(app);

describe('Recipe CRUD test', function() {
  it('should get a list of recipes', function(done) {

    agent.get('/api/recipes')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, results) {
        expect(results.body).to.be.an('array');
        expect(results.body).to.have.length.above(0);
        done();
      });
  });

  it('should get a single recipe by ID', function(done) {

    agent.get('/api/recipes/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, results) {
        var expectedKeys = ['id', 'name', 'author', 'ingredients', 'directions'];

        expect(results.body).to.be.an('object');
        expect(results.body.id).to.equal(1);
        expect(Object.keys(results.body)).to.eql(expectedKeys);

        done();
      });
  });

  it('should return Not Found for a non-existent recipe', function(done) {

    agent.get('/api/recipes/9999999')
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function(err, results) {
        var expectedKeys = ['id', 'name', 'author', 'ingredients', 'directions'];

        expect(results.status).to.equal(404);
        expect(results.body).to.be.an('object');
        expect(results.body.error).to.be.a('string');

        done();
      });
  });

  afterEach(function(done) {
    done();
  });
});
