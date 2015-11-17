
// # tests - assaults on officers

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

describe('/assaults-on-officers', function() {

  var AssaultsOnOfficer = IoC.create('models/assaults-on-officer');

  // Clean DB and add 3 sample assaults-on-officers before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestAssaultsOnOfficers(callback) {
        // Create 3 test assaults-on-officers
        async.timesSeries(3, function(i, _callback) {
          var assaultsOnOfficer = new AssaultsOnOfficer({
            name: 'AssaultsOnOfficer #' + i
          });

          assaultsOnOfficer.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /assaults-on-officers - should return 200 if assaultsOnOfficer was created', function(done) {
    request
      .post('/assaults-on-officers')
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
        context.assaultsOnOfficersIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /assaults-on-officers/:id — should return 200 if assaults on officers was retrieved', function(done) {
    request
      .get(util.format('/assaults-on-officers/%s', context.assaultsOnOfficersIdCreatedWithRequest))
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

  it('PUT /assaults-on-officers/:id - should return 200 if assaults on officers was updated', function(done) {
    request
      .put(util.format('/assaults-on-officers/%s', context.assaultsOnOfficersIdCreatedWithRequest))
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

  it('DELETE /assaults-on-officers/:id - should return 200 if assaults on officers was deleted', function(done) {
    request
      .del(util.format('/assaults-on-officers/%s', context.assaultsOnOfficersIdCreatedWithRequest))
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
        res.body.id.should.equal(context.assaultsOnOfficersIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /assaults-on-officers - should return 200 if assaults on officers index loads (JSON)', function(done) {
    request
      .get('/assaults-on-officers')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /assaults-on-officers - should return 200 if assaults on officers index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/assaults-on-officers')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $assaultsOnOfficerList = $('table');
        var $assaultsOnOfficerRows = $assaultsOnOfficerList.find('tr');

        // Test the values make sense
        $assaultsOnOfficerList.should.have.length.of(1);
        $assaultsOnOfficerRows.should.have.length.of.at.least(3);

        done();
      });
  });


});