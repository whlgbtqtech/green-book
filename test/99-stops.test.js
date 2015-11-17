
// # tests - stops

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

describe('/stops', function() {

  var Stop = IoC.create('models/stop');

  // Clean DB and add 3 sample stops before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestStops(callback) {
        // Create 3 test stops
        async.timesSeries(3, function(i, _callback) {
          var stop = new Stop({
            name: 'Stop #' + i
          });

          stop.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /stops - should return 200 if stop was created', function(done) {
    request
      .post('/stops')
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
        context.stopsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /stops/:id — should return 200 if stops was retrieved', function(done) {
    request
      .get(util.format('/stops/%s', context.stopsIdCreatedWithRequest))
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

  it('PUT /stops/:id - should return 200 if stops was updated', function(done) {
    request
      .put(util.format('/stops/%s', context.stopsIdCreatedWithRequest))
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

  it('DELETE /stops/:id - should return 200 if stops was deleted', function(done) {
    request
      .del(util.format('/stops/%s', context.stopsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.stopsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /stops - should return 200 if stops index loads (JSON)', function(done) {
    request
      .get('/stops')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /stops - should return 200 if stops index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/stops')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $stopList = $('table');
        var $stopRows = $stopList.find('tr');

        // Test the values make sense
        $stopList.should.have.length.of(1);
        $stopRows.should.have.length.of.at.least(3);

        done();
      });
  });


});