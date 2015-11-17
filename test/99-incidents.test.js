
// # tests - incidents

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

describe('/incidents', function() {

  var Incident = IoC.create('models/incident');

  // Clean DB and add 3 sample incidents before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestIncidents(callback) {
        // Create 3 test incidents
        async.timesSeries(3, function(i, _callback) {
          var incident = new Incident({
            name: 'Incident #' + i
          });

          incident.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /incidents - should return 200 if incident was created', function(done) {
    request
      .post('/incidents')
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
        context.incidentsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /incidents/:id — should return 200 if incidents was retrieved', function(done) {
    request
      .get(util.format('/incidents/%s', context.incidentsIdCreatedWithRequest))
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

  it('PUT /incidents/:id - should return 200 if incidents was updated', function(done) {
    request
      .put(util.format('/incidents/%s', context.incidentsIdCreatedWithRequest))
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

  it('DELETE /incidents/:id - should return 200 if incidents was deleted', function(done) {
    request
      .del(util.format('/incidents/%s', context.incidentsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.incidentsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /incidents - should return 200 if incidents index loads (JSON)', function(done) {
    request
      .get('/incidents')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /incidents - should return 200 if incidents index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/incidents')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $incidentList = $('table');
        var $incidentRows = $incidentList.find('tr');

        // Test the values make sense
        $incidentList.should.have.length.of(1);
        $incidentRows.should.have.length.of.at.least(3);

        done();
      });
  });


});