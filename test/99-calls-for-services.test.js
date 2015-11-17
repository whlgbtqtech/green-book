
// # tests - calls for services

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

describe('/calls-for-services', function() {

  var CallsForService = IoC.create('models/calls-for-service');

  // Clean DB and add 3 sample calls-for-services before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestCallsForServices(callback) {
        // Create 3 test calls-for-services
        async.timesSeries(3, function(i, _callback) {
          var callsForService = new CallsForService({
            name: 'CallsForService #' + i
          });

          callsForService.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /calls-for-services - should return 200 if callsForService was created', function(done) {
    request
      .post('/calls-for-services')
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
        context.callsForServicesIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /calls-for-services/:id — should return 200 if calls for services was retrieved', function(done) {
    request
      .get(util.format('/calls-for-services/%s', context.callsForServicesIdCreatedWithRequest))
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

  it('PUT /calls-for-services/:id - should return 200 if calls for services was updated', function(done) {
    request
      .put(util.format('/calls-for-services/%s', context.callsForServicesIdCreatedWithRequest))
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

  it('DELETE /calls-for-services/:id - should return 200 if calls for services was deleted', function(done) {
    request
      .del(util.format('/calls-for-services/%s', context.callsForServicesIdCreatedWithRequest))
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
        res.body.id.should.equal(context.callsForServicesIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /calls-for-services - should return 200 if calls for services index loads (JSON)', function(done) {
    request
      .get('/calls-for-services')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /calls-for-services - should return 200 if calls for services index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/calls-for-services')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $callsForServiceList = $('table');
        var $callsForServiceRows = $callsForServiceList.find('tr');

        // Test the values make sense
        $callsForServiceList.should.have.length.of(1);
        $callsForServiceRows.should.have.length.of.at.least(3);

        done();
      });
  });


});