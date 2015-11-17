
// # tests - racial profiling citations

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

describe('/racial-profiling-citations', function() {

  var RacialProfilingCitation = IoC.create('models/racial-profiling-citation');

  // Clean DB and add 3 sample racial-profiling-citations before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestRacialProfilingCitations(callback) {
        // Create 3 test racial-profiling-citations
        async.timesSeries(3, function(i, _callback) {
          var racialProfilingCitation = new RacialProfilingCitation({
            name: 'RacialProfilingCitation #' + i
          });

          racialProfilingCitation.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /racial-profiling-citations - should return 200 if racialProfilingCitation was created', function(done) {
    request
      .post('/racial-profiling-citations')
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
        context.racialProfilingCitationsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /racial-profiling-citations/:id — should return 200 if racial profiling citations was retrieved', function(done) {
    request
      .get(util.format('/racial-profiling-citations/%s', context.racialProfilingCitationsIdCreatedWithRequest))
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

  it('PUT /racial-profiling-citations/:id - should return 200 if racial profiling citations was updated', function(done) {
    request
      .put(util.format('/racial-profiling-citations/%s', context.racialProfilingCitationsIdCreatedWithRequest))
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

  it('DELETE /racial-profiling-citations/:id - should return 200 if racial profiling citations was deleted', function(done) {
    request
      .del(util.format('/racial-profiling-citations/%s', context.racialProfilingCitationsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.racialProfilingCitationsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /racial-profiling-citations - should return 200 if racial profiling citations index loads (JSON)', function(done) {
    request
      .get('/racial-profiling-citations')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /racial-profiling-citations - should return 200 if racial profiling citations index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/racial-profiling-citations')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $racialProfilingCitationList = $('table');
        var $racialProfilingCitationRows = $racialProfilingCitationList.find('tr');

        // Test the values make sense
        $racialProfilingCitationList.should.have.length.of(1);
        $racialProfilingCitationRows.should.have.length.of.at.least(3);

        done();
      });
  });


});