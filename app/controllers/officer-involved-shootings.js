
// # officer involved shooting

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(OfficerInvolvedShooting) {

  function index(req, res, next) {
    OfficerInvolvedShooting.paginate({}, req.query.page, req.query.limit, function(err, pageCount, officerInvolvedShootings, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('officer-involved-shootings', {
            officerInvolvedShootings: officerInvolvedShootings,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, officerInvolvedShootings.length),
            data: officerInvolvedShootings
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('officer-involved-shootings/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    OfficerInvolvedShooting.create({
      name: req.body.name
    }, function(err, officerInvolvedShooting) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created officer involved shooting');
          res.redirect('/officer-involved-shootings');
        },
        json: function() {
          res.json(officerInvolvedShooting);
        }
      });
    });
  }

  function show(req, res, next) {
    OfficerInvolvedShooting.findById(req.params.id, function(err, officerInvolvedShooting) {
      if (err) {
        return next(err);
      }

      if (!officerInvolvedShooting) {
        return next(new Error('Officer involved shooting does not exist'));
      }

      res.format({
        html: function() {
          res.render('officer-involved-shootings/show', {
            officerInvolvedShooting: officerInvolvedShooting
          });
        },
        json: function() {
          res.json(officerInvolvedShooting);
        }
      });
    });
  }

  function edit(req, res, next) {
    OfficerInvolvedShooting.findById(req.params.id, function(err, officerInvolvedShooting) {
      if (err) {
        return next(err);
      }

      if (!officerInvolvedShooting) {
        return next(new Error('Officer involved shooting does not exist'));
      }

      res.render('officer-involved-shootings/edit', {
        officerInvolvedShooting: officerInvolvedShooting
      });
    });
  }

  function update(req, res, next) {
    OfficerInvolvedShooting.findById(req.params.id, function(err, officerInvolvedShooting) {
      if (err) {
        return next(err);
      }

      if (!officerInvolvedShooting) {
        return next(new Error('Officer involved shooting does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      officerInvolvedShooting.name = req.body.name;
      officerInvolvedShooting.save(function(err, officerInvolvedShooting) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated officer involved shooting');
            res.redirect('/officer-involved-shootings/' + officerInvolvedShooting.id);
          },
          json: function() {
            res.json(officerInvolvedShooting);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    OfficerInvolvedShooting.findById(req.params.id, function(err, officerInvolvedShooting) {
      if (err) {
        return next(err);
      }

      if (!officerInvolvedShooting) {
        return next(new Error('Officer involved shooting does not exist'));
      }

      officerInvolvedShooting.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed officer involved shooting');
            res.redirect('/officer-involved-shootings');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: officerInvolvedShooting.id,
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
exports['@require'] = [ 'models/officer-involved-shooting' ];
