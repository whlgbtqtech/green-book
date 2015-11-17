
// # tests - response resistances

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

describe('/response-resistances', function() {

  var ResponseResistance = IoC.create('models/response-resistance');

  // Clean DB and add 3 sample response-resistances before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestResponseResistances(callback) {
        // Create 3 test response-resistances
        async.timesSeries(3, function(i, _callback) {
          var responseResistance = new ResponseResistance({
            name: 'ResponseResistance #' + i
          });

          responseResistance.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /response-resistances - should return 200 if responseResistance was created', function(done) {
    request
      .post('/response-resistances')
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
        context.responseResistancesIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /response-resistances/:id — should return 200 if response resistances was retrieved', function(done) {
    request
      .get(util.format('/response-resistances/%s', context.responseResistancesIdCreatedWithRequest))
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

  it('PUT /response-resistances/:id - should return 200 if response resistances was updated', function(done) {
    request
      .put(util.format('/response-resistances/%s', context.responseResistancesIdCreatedWithRequest))
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

  it('DELETE /response-resistances/:id - should return 200 if response resistances was deleted', function(done) {
    request
      .del(util.format('/response-resistances/%s', context.responseResistancesIdCreatedWithRequest))
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
        res.body.id.should.equal(context.responseResistancesIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /response-resistances - should return 200 if response resistances index loads (JSON)', function(done) {
    request
      .get('/response-resistances')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /response-resistances - should return 200 if response resistances index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/response-resistances')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $responseResistanceList = $('table');
        var $responseResistanceRows = $responseResistanceList.find('tr');

        // Test the values make sense
        $responseResistanceList.should.have.length.of(1);
        $responseResistanceRows.should.have.length.of.at.least(3);

        done();
      });
  });


});