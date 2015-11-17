
// # tests - body cam metas

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

describe('/body-cam-metas', function() {

  var BodyCamMeta = IoC.create('models/body-cam-meta');

  // Clean DB and add 3 sample body-cam-metas before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestBodyCamMetas(callback) {
        // Create 3 test body-cam-metas
        async.timesSeries(3, function(i, _callback) {
          var bodyCamMeta = new BodyCamMeta({
            name: 'BodyCamMeta #' + i
          });

          bodyCamMeta.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /body-cam-metas - should return 200 if bodyCamMeta was created', function(done) {
    request
      .post('/body-cam-metas')
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
        context.bodyCamMetasIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /body-cam-metas/:id — should return 200 if body cam metas was retrieved', function(done) {
    request
      .get(util.format('/body-cam-metas/%s', context.bodyCamMetasIdCreatedWithRequest))
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

  it('PUT /body-cam-metas/:id - should return 200 if body cam metas was updated', function(done) {
    request
      .put(util.format('/body-cam-metas/%s', context.bodyCamMetasIdCreatedWithRequest))
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

  it('DELETE /body-cam-metas/:id - should return 200 if body cam metas was deleted', function(done) {
    request
      .del(util.format('/body-cam-metas/%s', context.bodyCamMetasIdCreatedWithRequest))
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
        res.body.id.should.equal(context.bodyCamMetasIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /body-cam-metas - should return 200 if body cam metas index loads (JSON)', function(done) {
    request
      .get('/body-cam-metas')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /body-cam-metas - should return 200 if body cam metas index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/body-cam-metas')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $bodyCamMetaList = $('table');
        var $bodyCamMetaRows = $bodyCamMetaList.find('tr');

        // Test the values make sense
        $bodyCamMetaList.should.have.length.of(1);
        $bodyCamMetaRows.should.have.length.of.at.least(3);

        done();
      });
  });


});