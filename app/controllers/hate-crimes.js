
// # hate crime

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(HateCrime) {

  function index(req, res, next) {
    HateCrime.paginate({}, req.query.page, req.query.limit, function(err, pageCount, hateCrimes, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('hate-crimes', {
            hateCrimes: hateCrimes,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, hateCrimes.length),
            data: hateCrimes
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('hate-crimes/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    HateCrime.create({
      name: req.body.name
    }, function(err, hateCrime) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created hate crime');
          res.redirect('/hate-crimes');
        },
        json: function() {
          res.json(hateCrime);
        }
      });
    });
  }

  function show(req, res, next) {
    HateCrime.findById(req.params.id, function(err, hateCrime) {
      if (err) {
        return next(err);
      }

      if (!hateCrime) {
        return next(new Error('Hate crime does not exist'));
      }

      res.format({
        html: function() {
          res.render('hate-crimes/show', {
            hateCrime: hateCrime
          });
        },
        json: function() {
          res.json(hateCrime);
        }
      });
    });
  }

  function edit(req, res, next) {
    HateCrime.findById(req.params.id, function(err, hateCrime) {
      if (err) {
        return next(err);
      }

      if (!hateCrime) {
        return next(new Error('Hate crime does not exist'));
      }

      res.render('hate-crimes/edit', {
        hateCrime: hateCrime
      });
    });
  }

  function update(req, res, next) {
    HateCrime.findById(req.params.id, function(err, hateCrime) {
      if (err) {
        return next(err);
      }

      if (!hateCrime) {
        return next(new Error('Hate crime does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      hateCrime.name = req.body.name;
      hateCrime.save(function(err, hateCrime) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated hate crime');
            res.redirect('/hate-crimes/' + hateCrime.id);
          },
          json: function() {
            res.json(hateCrime);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    HateCrime.findById(req.params.id, function(err, hateCrime) {
      if (err) {
        return next(err);
      }

      if (!hateCrime) {
        return next(new Error('Hate crime does not exist'));
      }

      hateCrime.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed hate crime');
            res.redirect('/hate-crimes');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: hateCrime.id,
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
exports['@require'] = [ 'models/hate-crime' ];
