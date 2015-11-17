
// # racial profiling arrest

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(RacialProfilingArrest) {

  function index(req, res, next) {
    RacialProfilingArrest.paginate({}, req.query.page, req.query.limit, function(err, pageCount, racialProfilingArrests, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('racial-profiling-arrests', {
            racialProfilingArrests: racialProfilingArrests,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, racialProfilingArrests.length),
            data: racialProfilingArrests
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('racial-profiling-arrests/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    RacialProfilingArrest.create({
      name: req.body.name
    }, function(err, racialProfilingArrest) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created racial profiling arrest');
          res.redirect('/racial-profiling-arrests');
        },
        json: function() {
          res.json(racialProfilingArrest);
        }
      });
    });
  }

  function show(req, res, next) {
    RacialProfilingArrest.findById(req.params.id, function(err, racialProfilingArrest) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingArrest) {
        return next(new Error('Racial profiling arrest does not exist'));
      }

      res.format({
        html: function() {
          res.render('racial-profiling-arrests/show', {
            racialProfilingArrest: racialProfilingArrest
          });
        },
        json: function() {
          res.json(racialProfilingArrest);
        }
      });
    });
  }

  function edit(req, res, next) {
    RacialProfilingArrest.findById(req.params.id, function(err, racialProfilingArrest) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingArrest) {
        return next(new Error('Racial profiling arrest does not exist'));
      }

      res.render('racial-profiling-arrests/edit', {
        racialProfilingArrest: racialProfilingArrest
      });
    });
  }

  function update(req, res, next) {
    RacialProfilingArrest.findById(req.params.id, function(err, racialProfilingArrest) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingArrest) {
        return next(new Error('Racial profiling arrest does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      racialProfilingArrest.name = req.body.name;
      racialProfilingArrest.save(function(err, racialProfilingArrest) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated racial profiling arrest');
            res.redirect('/racial-profiling-arrests/' + racialProfilingArrest.id);
          },
          json: function() {
            res.json(racialProfilingArrest);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    RacialProfilingArrest.findById(req.params.id, function(err, racialProfilingArrest) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingArrest) {
        return next(new Error('Racial profiling arrest does not exist'));
      }

      racialProfilingArrest.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed racial profiling arrest');
            res.redirect('/racial-profiling-arrests');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: racialProfilingArrest.id,
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
exports['@require'] = [ 'models/racial-profiling-arrest' ];
