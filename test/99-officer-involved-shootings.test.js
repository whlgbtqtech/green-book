
// # tests - officer involved shootings

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

describe('/officer-involved-shootings', function() {

  var OfficerInvolvedShooting = IoC.create('models/officer-involved-shooting');

  // Clean DB and add 3 sample officer-involved-shootings before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestOfficerInvolvedShootings(callback) {
        // Create 3 test officer-involved-shootings
        async.timesSeries(3, function(i, _callback) {
          var officerInvolvedShooting = new OfficerInvolvedShooting({
            name: 'OfficerInvolvedShooting #' + i
          });

          officerInvolvedShooting.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /officer-involved-shootings - should return 200 if officerInvolvedShooting was created', function(done) {
    request
      .post('/officer-involved-shootings')
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
        context.officerInvolvedShootingsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /officer-involved-shootings/:id — should return 200 if officer involved shootings was retrieved', function(done) {
    request
      .get(util.format('/officer-involved-shootings/%s', context.officerInvolvedShootingsIdCreatedWithRequest))
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

  it('PUT /officer-involved-shootings/:id - should return 200 if officer involved shootings was updated', function(done) {
    request
      .put(util.format('/officer-involved-shootings/%s', context.officerInvolvedShootingsIdCreatedWithRequest))
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

  it('DELETE /officer-involved-shootings/:id - should return 200 if officer involved shootings was deleted', function(done) {
    request
      .del(util.format('/officer-involved-shootings/%s', context.officerInvolvedShootingsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.officerInvolvedShootingsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /officer-involved-shootings - should return 200 if officer involved shootings index loads (JSON)', function(done) {
    request
      .get('/officer-involved-shootings')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /officer-involved-shootings - should return 200 if officer involved shootings index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/officer-involved-shootings')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $officerInvolvedShootingList = $('table');
        var $officerInvolvedShootingRows = $officerInvolvedShootingList.find('tr');

        // Test the values make sense
        $officerInvolvedShootingList.should.have.length.of(1);
        $officerInvolvedShootingRows.should.have.length.of.at.least(3);

        done();
      });
  });


});