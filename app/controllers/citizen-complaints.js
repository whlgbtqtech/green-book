
// # citizen complaint

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(CitizenComplaint) {

  function index(req, res, next) {
    CitizenComplaint.paginate({}, req.query.page, req.query.limit, function(err, pageCount, citizenComplaints, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('citizen-complaints', {
            citizenComplaints: citizenComplaints,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, citizenComplaints.length),
            data: citizenComplaints
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('citizen-complaints/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    CitizenComplaint.create({
      name: req.body.name
    }, function(err, citizenComplaint) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created citizen complaint');
          res.redirect('/citizen-complaints');
        },
        json: function() {
          res.json(citizenComplaint);
        }
      });
    });
  }

  function show(req, res, next) {
    CitizenComplaint.findById(req.params.id, function(err, citizenComplaint) {
      if (err) {
        return next(err);
      }

      if (!citizenComplaint) {
        return next(new Error('Citizen complaint does not exist'));
      }

      res.format({
        html: function() {
          res.render('citizen-complaints/show', {
            citizenComplaint: citizenComplaint
          });
        },
        json: function() {
          res.json(citizenComplaint);
        }
      });
    });
  }

  function edit(req, res, next) {
    CitizenComplaint.findById(req.params.id, function(err, citizenComplaint) {
      if (err) {
        return next(err);
      }

      if (!citizenComplaint) {
        return next(new Error('Citizen complaint does not exist'));
      }

      res.render('citizen-complaints/edit', {
        citizenComplaint: citizenComplaint
      });
    });
  }

  function update(req, res, next) {
    CitizenComplaint.findById(req.params.id, function(err, citizenComplaint) {
      if (err) {
        return next(err);
      }

      if (!citizenComplaint) {
        return next(new Error('Citizen complaint does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      citizenComplaint.name = req.body.name;
      citizenComplaint.save(function(err, citizenComplaint) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated citizen complaint');
            res.redirect('/citizen-complaints/' + citizenComplaint.id);
          },
          json: function() {
            res.json(citizenComplaint);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    CitizenComplaint.findById(req.params.id, function(err, citizenComplaint) {
      if (err) {
        return next(err);
      }

      if (!citizenComplaint) {
        return next(new Error('Citizen complaint does not exist'));
      }

      citizenComplaint.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed citizen complaint');
            res.redirect('/citizen-complaints');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: citizenComplaint.id,
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
exports['@require'] = [ 'models/citizen-complaint' ];
