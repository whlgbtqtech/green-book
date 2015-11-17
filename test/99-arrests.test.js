
// # tests - arrests

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

describe('/arrests', function() {

  var Arrest = IoC.create('models/arrest');

  // Clean DB and add 3 sample arrests before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestArrests(callback) {
        // Create 3 test arrests
        async.timesSeries(3, function(i, _callback) {
          var arrest = new Arrest({
            name: 'Arrest #' + i
          });

          arrest.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /arrests - should return 200 if arrest was created', function(done) {
    request
      .post('/arrests')
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
        context.arrestsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /arrests/:id — should return 200 if arrests was retrieved', function(done) {
    request
      .get(util.format('/arrests/%s', context.arrestsIdCreatedWithRequest))
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

  it('PUT /arrests/:id - should return 200 if arrests was updated', function(done) {
    request
      .put(util.format('/arrests/%s', context.arrestsIdCreatedWithRequest))
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

  it('DELETE /arrests/:id - should return 200 if arrests was deleted', function(done) {
    request
      .del(util.format('/arrests/%s', context.arrestsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.arrestsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /arrests - should return 200 if arrests index loads (JSON)', function(done) {
    request
      .get('/arrests')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /arrests - should return 200 if arrests index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/arrests')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $arrestList = $('table');
        var $arrestRows = $arrestList.find('tr');

        // Test the values make sense
        $arrestList.should.have.length.of(1);
        $arrestRows.should.have.length.of.at.least(3);

        done();
      });
  });


});