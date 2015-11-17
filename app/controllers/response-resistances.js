
// # response resistance

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(ResponseResistance) {

  function index(req, res, next) {
    ResponseResistance.paginate({}, req.query.page, req.query.limit, function(err, pageCount, responseResistances, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('response-resistances', {
            responseResistances: responseResistances,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, responseResistances.length),
            data: responseResistances
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('response-resistances/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    ResponseResistance.create({
      name: req.body.name
    }, function(err, responseResistance) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created response resistance');
          res.redirect('/response-resistances');
        },
        json: function() {
          res.json(responseResistance);
        }
      });
    });
  }

  function show(req, res, next) {
    ResponseResistance.findById(req.params.id, function(err, responseResistance) {
      if (err) {
        return next(err);
      }

      if (!responseResistance) {
        return next(new Error('Response resistance does not exist'));
      }

      res.format({
        html: function() {
          res.render('response-resistances/show', {
            responseResistance: responseResistance
          });
        },
        json: function() {
          res.json(responseResistance);
        }
      });
    });
  }

  function edit(req, res, next) {
    ResponseResistance.findById(req.params.id, function(err, responseResistance) {
      if (err) {
        return next(err);
      }

      if (!responseResistance) {
        return next(new Error('Response resistance does not exist'));
      }

      res.render('response-resistances/edit', {
        responseResistance: responseResistance
      });
    });
  }

  function update(req, res, next) {
    ResponseResistance.findById(req.params.id, function(err, responseResistance) {
      if (err) {
        return next(err);
      }

      if (!responseResistance) {
        return next(new Error('Response resistance does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      responseResistance.name = req.body.name;
      responseResistance.save(function(err, responseResistance) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated response resistance');
            res.redirect('/response-resistances/' + responseResistance.id);
          },
          json: function() {
            res.json(responseResistance);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    ResponseResistance.findById(req.params.id, function(err, responseResistance) {
      if (err) {
        return next(err);
      }

      if (!responseResistance) {
        return next(new Error('Response resistance does not exist'));
      }

      responseResistance.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed response resistance');
            res.redirect('/response-resistances');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: responseResistance.id,
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
exports['@require'] = [ 'models/response-resistance' ];
