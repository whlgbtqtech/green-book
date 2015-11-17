
// # tests - use of forces

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

describe('/use-of-forces', function() {

  var UseOfForce = IoC.create('models/use-of-force');

  // Clean DB and add 3 sample use-of-forces before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestUseOfForces(callback) {
        // Create 3 test use-of-forces
        async.timesSeries(3, function(i, _callback) {
          var useOfForce = new UseOfForce({
            name: 'UseOfForce #' + i
          });

          useOfForce.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /use-of-forces - should return 200 if useOfForce was created', function(done) {
    request
      .post('/use-of-forces')
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
        context.useOfForcesIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /use-of-forces/:id — should return 200 if use of forces was retrieved', function(done) {
    request
      .get(util.format('/use-of-forces/%s', context.useOfForcesIdCreatedWithRequest))
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

  it('PUT /use-of-forces/:id - should return 200 if use of forces was updated', function(done) {
    request
      .put(util.format('/use-of-forces/%s', context.useOfForcesIdCreatedWithRequest))
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

  it('DELETE /use-of-forces/:id - should return 200 if use of forces was deleted', function(done) {
    request
      .del(util.format('/use-of-forces/%s', context.useOfForcesIdCreatedWithRequest))
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
        res.body.id.should.equal(context.useOfForcesIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /use-of-forces - should return 200 if use of forces index loads (JSON)', function(done) {
    request
      .get('/use-of-forces')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /use-of-forces - should return 200 if use of forces index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/use-of-forces')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $useOfForceList = $('table');
        var $useOfForceRows = $useOfForceList.find('tr');

        // Test the values make sense
        $useOfForceList.should.have.length.of(1);
        $useOfForceRows.should.have.length.of.at.least(3);

        done();
      });
  });


});