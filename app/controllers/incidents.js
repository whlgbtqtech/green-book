
// # incident

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(Incident) {

  function index(req, res, next) {
    Incident.paginate({}, req.query.page, req.query.limit, function(err, pageCount, incidents, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('incidents', {
            incidents: incidents,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, incidents.length),
            data: incidents
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('incidents/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    Incident.create({
      name: req.body.name
    }, function(err, incident) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created incident');
          res.redirect('/incidents');
        },
        json: function() {
          res.json(incident);
        }
      });
    });
  }

  function show(req, res, next) {
    Incident.findById(req.params.id, function(err, incident) {
      if (err) {
        return next(err);
      }

      if (!incident) {
        return next(new Error('Incident does not exist'));
      }

      res.format({
        html: function() {
          res.render('incidents/show', {
            incident: incident
          });
        },
        json: function() {
          res.json(incident);
        }
      });
    });
  }

  function edit(req, res, next) {
    Incident.findById(req.params.id, function(err, incident) {
      if (err) {
        return next(err);
      }

      if (!incident) {
        return next(new Error('Incident does not exist'));
      }

      res.render('incidents/edit', {
        incident: incident
      });
    });
  }

  function update(req, res, next) {
    Incident.findById(req.params.id, function(err, incident) {
      if (err) {
        return next(err);
      }

      if (!incident) {
        return next(new Error('Incident does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      incident.name = req.body.name;
      incident.save(function(err, incident) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated incident');
            res.redirect('/incidents/' + incident.id);
          },
          json: function() {
            res.json(incident);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    Incident.findById(req.params.id, function(err, incident) {
      if (err) {
        return next(err);
      }

      if (!incident) {
        return next(new Error('Incident does not exist'));
      }

      incident.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed incident');
            res.redirect('/incidents');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: incident.id,
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
exports['@require'] = [ 'models/incident' ];
