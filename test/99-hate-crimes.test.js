
// # tests - hate crimes

var util = require('util');
var request = require('supertest');
var app = require('../app');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
var utils = require('./utils');
var async = require('async');
var IoC = require('electrolyte');
var cheerio = require('cheerio');

chai.should();
chai.use(sinonChai);

request = request(app);

// storage for context-specific variables throughout the tests
var context = {};

describe('/hate-crimes', function() {

  var HateCrime = IoC.create('models/hate-crime');

  // Clean DB and add 3 sample hate-crimes before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestHateCrimes(callback) {
        // Create 3 test hate-crimes
        async.timesSeries(3, function(i, _callback) {
          var hateCrime = new HateCrime({
            name: 'HateCrime #' + i
          });

          hateCrime.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /hate-crimes - should return 200 if hateCrime was created', function(done) {
    request
      .post('/hate-crimes')
      .set({
        'X-Requested-With': 'XMLHttpRequest'// We need to set this so CSRF is ignored when enabled
      })
      .accept('application/json')
      .send({
        name: 'Nifty',
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.body).to.exist
        res.body.should.have.property('id');
        res.body.should.have.property('name');

        // Test the values make sense
        res.body.name.should.equal('Nifty');

        // Store this id to use later
        context.hateCrimesIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /hate-crimes/:id — should return 200 if hate crimes was retrieved', function(done) {
    request
      .get(util.format('/hate-crimes/%s', context.hateCrimesIdCreatedWithRequest))
      .accept('application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.body).to.exist;
        res.body.should.have.property('id');
        res.body.should.have.property('name');

        // Test the values make sense
        res.body.name.should.equal('Nifty');

        done();
      });
  });

  it('PUT /hate-crimes/:id - should return 200 if hate crimes was updated', function(done) {
    request
      .put(util.format('/hate-crimes/%s', context.hateCrimesIdCreatedWithRequest))
      .set({
        'X-Requested-With': 'XMLHttpRequest'// We need to set this so CSRF is ignored when enabled
      })
      .accept('application/json')
      .send({
        name: 'NiftyWhoa'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.body).to.exist;
        res.body.should.have.property('id');
        res.body.should.have.property('name');

        // Test the values make sense
        res.body.name.should.equal('NiftyWhoa');

        done();
      });
  });

  it('DELETE /hate-crimes/:id - should return 200 if hate crimes was deleted', function(done) {
    request
      .del(util.format('/hate-crimes/%s', context.hateCrimesIdCreatedWithRequest))
      .set({
        'X-Requested-With': 'XMLHttpRequest'// We need to set this so CSRF is ignored when enabled
      })
      .accept('application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.body).to.exist;
        res.body.should.have.property('id');
        res.body.should.have.property('deleted');

        // Test the values make sense
        res.body.id.should.equal(context.hateCrimesIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /hate-crimes - should return 200 if hate crimes index loads (JSON)', function(done) {
    request
      .get('/hate-crimes')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /hate-crimes - should return 200 if hate crimes index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/hate-crimes')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $hateCrimeList = $('table');
        var $hateCrimeRows = $hateCrimeList.find('tr');

        // Test the values make sense
        $hateCrimeList.should.have.length.of(1);
        $hateCrimeRows.should.have.length.of.at.least(3);

        done();
      });
  });


});