
// # use of force

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(UseOfForce) {

  function index(req, res, next) {
    UseOfForce.paginate({}, req.query.page, req.query.limit, function(err, pageCount, useOfForces, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('use-of-forces', {
            useOfForces: useOfForces,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, useOfForces.length),
            data: useOfForces
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('use-of-forces/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    UseOfForce.create({
      name: req.body.name
    }, function(err, useOfForce) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created use of force');
          res.redirect('/use-of-forces');
        },
        json: function() {
          res.json(useOfForce);
        }
      });
    });
  }

  function show(req, res, next) {
    UseOfForce.findById(req.params.id, function(err, useOfForce) {
      if (err) {
        return next(err);
      }

      if (!useOfForce) {
        return next(new Error('Use of force does not exist'));
      }

      res.format({
        html: function() {
          res.render('use-of-forces/show', {
            useOfForce: useOfForce
          });
        },
        json: function() {
          res.json(useOfForce);
        }
      });
    });
  }

  function edit(req, res, next) {
    UseOfForce.findById(req.params.id, function(err, useOfForce) {
      if (err) {
        return next(err);
      }

      if (!useOfForce) {
        return next(new Error('Use of force does not exist'));
      }

      res.render('use-of-forces/edit', {
        useOfForce: useOfForce
      });
    });
  }

  function update(req, res, next) {
    UseOfForce.findById(req.params.id, function(err, useOfForce) {
      if (err) {
        return next(err);
      }

      if (!useOfForce) {
        return next(new Error('Use of force does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      useOfForce.name = req.body.name;
      useOfForce.save(function(err, useOfForce) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated use of force');
            res.redirect('/use-of-forces/' + useOfForce.id);
          },
          json: function() {
            res.json(useOfForce);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    UseOfForce.findById(req.params.id, function(err, useOfForce) {
      if (err) {
        return next(err);
      }

      if (!useOfForce) {
        return next(new Error('Use of force does not exist'));
      }

      useOfForce.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed use of force');
            res.redirect('/use-of-forces');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: useOfForce.id,
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
exports['@require'] = [ 'models/use-of-force' ];
