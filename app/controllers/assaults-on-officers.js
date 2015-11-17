
// # assaults on officer

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(AssaultsOnOfficer) {

  function index(req, res, next) {
    AssaultsOnOfficer.paginate({}, req.query.page, req.query.limit, function(err, pageCount, assaultsOnOfficers, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('assaults-on-officers', {
            assaultsOnOfficers: assaultsOnOfficers,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, assaultsOnOfficers.length),
            data: assaultsOnOfficers
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('assaults-on-officers/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    AssaultsOnOfficer.create({
      name: req.body.name
    }, function(err, assaultsOnOfficer) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created assaults on officer');
          res.redirect('/assaults-on-officers');
        },
        json: function() {
          res.json(assaultsOnOfficer);
        }
      });
    });
  }

  function show(req, res, next) {
    AssaultsOnOfficer.findById(req.params.id, function(err, assaultsOnOfficer) {
      if (err) {
        return next(err);
      }

      if (!assaultsOnOfficer) {
        return next(new Error('Assaults on officer does not exist'));
      }

      res.format({
        html: function() {
          res.render('assaults-on-officers/show', {
            assaultsOnOfficer: assaultsOnOfficer
          });
        },
        json: function() {
          res.json(assaultsOnOfficer);
        }
      });
    });
  }

  function edit(req, res, next) {
    AssaultsOnOfficer.findById(req.params.id, function(err, assaultsOnOfficer) {
      if (err) {
        return next(err);
      }

      if (!assaultsOnOfficer) {
        return next(new Error('Assaults on officer does not exist'));
      }

      res.render('assaults-on-officers/edit', {
        assaultsOnOfficer: assaultsOnOfficer
      });
    });
  }

  function update(req, res, next) {
    AssaultsOnOfficer.findById(req.params.id, function(err, assaultsOnOfficer) {
      if (err) {
        return next(err);
      }

      if (!assaultsOnOfficer) {
        return next(new Error('Assaults on officer does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      assaultsOnOfficer.name = req.body.name;
      assaultsOnOfficer.save(function(err, assaultsOnOfficer) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated assaults on officer');
            res.redirect('/assaults-on-officers/' + assaultsOnOfficer.id);
          },
          json: function() {
            res.json(assaultsOnOfficer);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    AssaultsOnOfficer.findById(req.params.id, function(err, assaultsOnOfficer) {
      if (err) {
        return next(err);
      }

      if (!assaultsOnOfficer) {
        return next(new Error('Assaults on officer does not exist'));
      }

      assaultsOnOfficer.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed assaults on officer');
            res.redirect('/assaults-on-officers');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: assaultsOnOfficer.id,
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
exports['@require'] = [ 'models/assaults-on-officer' ];
