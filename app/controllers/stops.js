
// # stop

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(Stop) {

  function index(req, res, next) {
    Stop.paginate({}, req.query.page, req.query.limit, function(err, pageCount, stops, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('stops', {
            stops: stops,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, stops.length),
            data: stops
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('stops/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    Stop.create({
      name: req.body.name
    }, function(err, stop) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created stop');
          res.redirect('/stops');
        },
        json: function() {
          res.json(stop);
        }
      });
    });
  }

  function show(req, res, next) {
    Stop.findById(req.params.id, function(err, stop) {
      if (err) {
        return next(err);
      }

      if (!stop) {
        return next(new Error('Stop does not exist'));
      }

      res.format({
        html: function() {
          res.render('stops/show', {
            stop: stop
          });
        },
        json: function() {
          res.json(stop);
        }
      });
    });
  }

  function edit(req, res, next) {
    Stop.findById(req.params.id, function(err, stop) {
      if (err) {
        return next(err);
      }

      if (!stop) {
        return next(new Error('Stop does not exist'));
      }

      res.render('stops/edit', {
        stop: stop
      });
    });
  }

  function update(req, res, next) {
    Stop.findById(req.params.id, function(err, stop) {
      if (err) {
        return next(err);
      }

      if (!stop) {
        return next(new Error('Stop does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      stop.name = req.body.name;
      stop.save(function(err, stop) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated stop');
            res.redirect('/stops/' + stop.id);
          },
          json: function() {
            res.json(stop);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    Stop.findById(req.params.id, function(err, stop) {
      if (err) {
        return next(err);
      }

      if (!stop) {
        return next(new Error('Stop does not exist'));
      }

      stop.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed stop');
            res.redirect('/stops');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: stop.id,
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
exports['@require'] = [ 'models/stop' ];
