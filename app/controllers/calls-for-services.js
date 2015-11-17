
// # calls for service

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(CallsForService) {

  function index(req, res, next) {
    CallsForService.paginate({}, req.query.page, req.query.limit, function(err, pageCount, callsForServices, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('calls-for-services', {
            callsForServices: callsForServices,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, callsForServices.length),
            data: callsForServices
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('calls-for-services/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    CallsForService.create({
      name: req.body.name
    }, function(err, callsForService) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created calls for service');
          res.redirect('/calls-for-services');
        },
        json: function() {
          res.json(callsForService);
        }
      });
    });
  }

  function show(req, res, next) {
    CallsForService.findById(req.params.id, function(err, callsForService) {
      if (err) {
        return next(err);
      }

      if (!callsForService) {
        return next(new Error('Calls for service does not exist'));
      }

      res.format({
        html: function() {
          res.render('calls-for-services/show', {
            callsForService: callsForService
          });
        },
        json: function() {
          res.json(callsForService);
        }
      });
    });
  }

  function edit(req, res, next) {
    CallsForService.findById(req.params.id, function(err, callsForService) {
      if (err) {
        return next(err);
      }

      if (!callsForService) {
        return next(new Error('Calls for service does not exist'));
      }

      res.render('calls-for-services/edit', {
        callsForService: callsForService
      });
    });
  }

  function update(req, res, next) {
    CallsForService.findById(req.params.id, function(err, callsForService) {
      if (err) {
        return next(err);
      }

      if (!callsForService) {
        return next(new Error('Calls for service does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      callsForService.name = req.body.name;
      callsForService.save(function(err, callsForService) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated calls for service');
            res.redirect('/calls-for-services/' + callsForService.id);
          },
          json: function() {
            res.json(callsForService);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    CallsForService.findById(req.params.id, function(err, callsForService) {
      if (err) {
        return next(err);
      }

      if (!callsForService) {
        return next(new Error('Calls for service does not exist'));
      }

      callsForService.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed calls for service');
            res.redirect('/calls-for-services');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: callsForService.id,
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
exports['@require'] = [ 'models/calls-for-service' ];
