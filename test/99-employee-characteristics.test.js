
// # tests - employee characteristics

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

describe('/employee-characteristics', function() {

  var EmployeeCharacteristic = IoC.create('models/employee-characteristic');

  // Clean DB and add 3 sample employee-characteristics before tests start
  before(function(done) {
    async.waterfall([
      utils.cleanDatabase,
      function createTestEmployeeCharacteristics(callback) {
        // Create 3 test employee-characteristics
        async.timesSeries(3, function(i, _callback) {
          var employeeCharacteristic = new EmployeeCharacteristic({
            name: 'EmployeeCharacteristic #' + i
          });

          employeeCharacteristic.save(_callback);
        }, callback);
      }
    ], done);
  });

  // Clean DB after all tests are done
  after(function(done) {
    utils.cleanDatabase(done);
  });

  it('POST /employee-characteristics - should return 200 if employeeCharacteristic was created', function(done) {
    request
      .post('/employee-characteristics')
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
        context.employeeCharacteristicsIdCreatedWithRequest = res.body.id;

        done();
      });
  });

  it('GET /employee-characteristics/:id — should return 200 if employee characteristics was retrieved', function(done) {
    request
      .get(util.format('/employee-characteristics/%s', context.employeeCharacteristicsIdCreatedWithRequest))
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

  it('PUT /employee-characteristics/:id - should return 200 if employee characteristics was updated', function(done) {
    request
      .put(util.format('/employee-characteristics/%s', context.employeeCharacteristicsIdCreatedWithRequest))
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

  it('DELETE /employee-characteristics/:id - should return 200 if employee characteristics was deleted', function(done) {
    request
      .del(util.format('/employee-characteristics/%s', context.employeeCharacteristicsIdCreatedWithRequest))
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
        res.body.id.should.equal(context.employeeCharacteristicsIdCreatedWithRequest);
        res.body.deleted.should.equal(true);

        done();
      });
  });

  it('GET /employee-characteristics - should return 200 if employee characteristics index loads (JSON)', function(done) {
    request
      .get('/employee-characteristics')
      .accept('application/json')
      .expect(200, done);
  });
  
  it('GET /employee-characteristics - should return 200 if employee characteristics index loads and shows 3 rows (HTML)', function(done) {
    request
      .get('/employee-characteristics')
      .accept('text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        // Test the attributes exist
        expect(res.text).to.exist;

        var $ = cheerio.load(res.text)
        var $employeeCharacteristicList = $('table');
        var $employeeCharacteristicRows = $employeeCharacteristicList.find('tr');

        // Test the values make sense
        $employeeCharacteristicList.should.have.length.of(1);
        $employeeCharacteristicRows.should.have.length.of.at.least(3);

        done();
      });
  });


});