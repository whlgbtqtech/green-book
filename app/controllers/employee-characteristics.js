
// # employee characteristic

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(EmployeeCharacteristic) {

  function index(req, res, next) {
    EmployeeCharacteristic.paginate({}, req.query.page, req.query.limit, function(err, pageCount, employeeCharacteristics, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('employee-characteristics', {
            employeeCharacteristics: employeeCharacteristics,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, employeeCharacteristics.length),
            data: employeeCharacteristics
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('employee-characteristics/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    EmployeeCharacteristic.create({
      name: req.body.name
    }, function(err, employeeCharacteristic) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created employee characteristic');
          res.redirect('/employee-characteristics');
        },
        json: function() {
          res.json(employeeCharacteristic);
        }
      });
    });
  }

  function show(req, res, next) {
    EmployeeCharacteristic.findById(req.params.id, function(err, employeeCharacteristic) {
      if (err) {
        return next(err);
      }

      if (!employeeCharacteristic) {
        return next(new Error('Employee characteristic does not exist'));
      }

      res.format({
        html: function() {
          res.render('employee-characteristics/show', {
            employeeCharacteristic: employeeCharacteristic
          });
        },
        json: function() {
          res.json(employeeCharacteristic);
        }
      });
    });
  }

  function edit(req, res, next) {
    EmployeeCharacteristic.findById(req.params.id, function(err, employeeCharacteristic) {
      if (err) {
        return next(err);
      }

      if (!employeeCharacteristic) {
        return next(new Error('Employee characteristic does not exist'));
      }

      res.render('employee-characteristics/edit', {
        employeeCharacteristic: employeeCharacteristic
      });
    });
  }

  function update(req, res, next) {
    EmployeeCharacteristic.findById(req.params.id, function(err, employeeCharacteristic) {
      if (err) {
        return next(err);
      }

      if (!employeeCharacteristic) {
        return next(new Error('Employee characteristic does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      employeeCharacteristic.name = req.body.name;
      employeeCharacteristic.save(function(err, employeeCharacteristic) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated employee characteristic');
            res.redirect('/employee-characteristics/' + employeeCharacteristic.id);
          },
          json: function() {
            res.json(employeeCharacteristic);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    EmployeeCharacteristic.findById(req.params.id, function(err, employeeCharacteristic) {
      if (err) {
        return next(err);
      }

      if (!employeeCharacteristic) {
        return next(new Error('Employee characteristic does not exist'));
      }

      employeeCharacteristic.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed employee characteristic');
            res.redirect('/employee-characteristics');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: employeeCharacteristic.id,
              deleted: true
            });
          }
        });
      });
    });
  }

  return {
    index: index,
    'new': _new,
    create: create,
    show: show,
    edit: edit,
    update: update,
    destroy: destroy
  };

};

exports['@singleton'] = true;
exports['@require'] = [ 'models/employee-characteristic' ];
