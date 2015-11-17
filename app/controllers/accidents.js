
// # accident

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(Accident) {

  function index(req, res, next) {
    Accident.paginate({}, req.query.page, req.query.limit, function(err, pageCount, accidents, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('accidents', {
            accidents: accidents,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, accidents.length),
            data: accidents
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('accidents/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    Accident.create({
      name: req.body.name
    }, function(err, accident) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created accident');
          res.redirect('/accidents');
        },
        json: function() {
          res.json(accident);
        }
      });
    });
  }

  function show(req, res, next) {
    Accident.findById(req.params.id, function(err, accident) {
      if (err) {
        return next(err);
      }

      if (!accident) {
        return next(new Error('Accident does not exist'));
      }

      res.format({
        html: function() {
          res.render('accidents/show', {
            accident: accident
          });
        },
        json: function() {
          res.json(accident);
        }
      });
    });
  }

  function edit(req, res, next) {
    Accident.findById(req.params.id, function(err, accident) {
      if (err) {
        return next(err);
      }

      if (!accident) {
        return next(new Error('Accident does not exist'));
      }

      res.render('accidents/edit', {
        accident: accident
      });
    });
  }

  function update(req, res, next) {
    Accident.findById(req.params.id, function(err, accident) {
      if (err) {
        return next(err);
      }

      if (!accident) {
        return next(new Error('Accident does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      accident.name = req.body.name;
      accident.save(function(err, accident) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated accident');
            res.redirect('/accidents/' + accident.id);
          },
          json: function() {
            res.json(accident);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    Accident.findById(req.params.id, function(err, accident) {
      if (err) {
        return next(err);
      }

      if (!accident) {
        return next(new Error('Accident does not exist'));
      }

      accident.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed accident');
            res.redirect('/accidents');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: accident.id,
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
exports['@require'] = [ 'models/accident' ];
