
// # tests - citizen complaints

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

describe('/citizen-complaints', function() {

  var CitizenComplaint = IoC.create('models/citizen-complaint');

  // Clean DB and add 3 sample citizen-complaints before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestCitizenComplaints(callback) {
        // Create 3 test citizen-complaints
        async.timesSeries(3, function(i, _callback) {
          var citizenComplaint = new CitizenComplaint({
            name: 'CitizenComplaint #' + i
          });

          citizenComplaint.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /citizen-complaints - should return 200 if citizenComplaint was created', function(done) {
    request
      .post('/citizen-complaints')
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
        context.citizenComplaintsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /citizen-complaints/:id — should return 200 if citizen complaints was retrieved', function(done) {
    request
      .get(util.format('/citizen-complaints/%s', context.citizenComplaintsIdCreatedWithRequest))
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

  it('PUT /citizen-complaints/:id - should return 200 if citizen complaints was updated', function(done) {
    request
      .put(util.format('/citizen-complaints/%s', context.citizenComplaintsIdCreatedWithRequest))
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

  it('DELETE /citizen-complaints/:id - should return 200 if citizen complaints was deleted', function(done) {
    request
      .del(util.format('/citizen-complaints/%s', context.citizenComplaintsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.citizenComplaintsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /citizen-complaints - should return 200 if citizen complaints index loads (JSON)', function(done) {
    request
      .get('/citizen-complaints')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /citizen-complaints - should return 200 if citizen complaints index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/citizen-complaints')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $citizenComplaintList = $('table');
        var $citizenComplaintRows = $citizenComplaintList.find('tr');

        // Test the values make sense
        $citizenComplaintList.should.have.length.of(1);
        $citizenComplaintRows.should.have.length.of.at.least(3);

        done();
      });
  });


});