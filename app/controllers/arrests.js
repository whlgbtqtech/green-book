
// # arrest

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(Arrest) {

  function index(req, res, next) {
    Arrest.paginate({}, req.query.page, req.query.limit, function(err, pageCount, arrests, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('arrests', {
            arrests: arrests,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, arrests.length),
            data: arrests
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('arrests/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    Arrest.create({
      name: req.body.name
    }, function(err, arrest) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created arrest');
          res.redirect('/arrests');
        },
        json: function() {
          res.json(arrest);
        }
      });
    });
  }

  function show(req, res, next) {
    Arrest.findById(req.params.id, function(err, arrest) {
      if (err) {
        return next(err);
      }

      if (!arrest) {
        return next(new Error('Arrest does not exist'));
      }

      res.format({
        html: function() {
          res.render('arrests/show', {
            arrest: arrest
          });
        },
        json: function() {
          res.json(arrest);
        }
      });
    });
  }

  function edit(req, res, next) {
    Arrest.findById(req.params.id, function(err, arrest) {
      if (err) {
        return next(err);
      }

      if (!arrest) {
        return next(new Error('Arrest does not exist'));
      }

      res.render('arrests/edit', {
        arrest: arrest
      });
    });
  }

  function update(req, res, next) {
    Arrest.findById(req.params.id, function(err, arrest) {
      if (err) {
        return next(err);
      }

      if (!arrest) {
        return next(new Error('Arrest does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      arrest.name = req.body.name;
      arrest.save(function(err, arrest) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated arrest');
            res.redirect('/arrests/' + arrest.id);
          },
          json: function() {
            res.json(arrest);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    Arrest.findById(req.params.id, function(err, arrest) {
      if (err) {
        return next(err);
      }

      if (!arrest) {
        return next(new Error('Arrest does not exist'));
      }

      arrest.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed arrest');
            res.redirect('/arrests');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: arrest.id,
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
exports['@require'] = [ 'models/arrest' ];
