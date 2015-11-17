
// # tests - accidents

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

describe('/accidents', function() {

  var Accident = IoC.create('models/accident');

  // Clean DB and add 3 sample accidents before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestAccidents(callback) {
        // Create 3 test accidents
        async.timesSeries(3, function(i, _callback) {
          var accident = new Accident({
            name: 'Accident #' + i
          });

          accident.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /accidents - should return 200 if accident was created', function(done) {
    request
      .post('/accidents')
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
        context.accidentsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /accidents/:id — should return 200 if accidents was retrieved', function(done) {
    request
      .get(util.format('/accidents/%s', context.accidentsIdCreatedWithRequest))
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

  it('PUT /accidents/:id - should return 200 if accidents was updated', function(done) {
    request
      .put(util.format('/accidents/%s', context.accidentsIdCreatedWithRequest))
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

  it('DELETE /accidents/:id - should return 200 if accidents was deleted', function(done) {
    request
      .del(util.format('/accidents/%s', context.accidentsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.accidentsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /accidents - should return 200 if accidents index loads (JSON)', function(done) {
    request
      .get('/accidents')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /accidents - should return 200 if accidents index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/accidents')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $accidentList = $('table');
        var $accidentRows = $accidentList.find('tr');

        // Test the values make sense
        $accidentList.should.have.length.of(1);
        $accidentRows.should.have.length.of.at.least(3);

        done();
      });
  });


});