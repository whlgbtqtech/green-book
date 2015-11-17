
// # racial profiling citation

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(RacialProfilingCitation) {

  function index(req, res, next) {
    RacialProfilingCitation.paginate({}, req.query.page, req.query.limit, function(err, pageCount, racialProfilingCitations, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('racial-profiling-citations', {
            racialProfilingCitations: racialProfilingCitations,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, racialProfilingCitations.length),
            data: racialProfilingCitations
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('racial-profiling-citations/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    RacialProfilingCitation.create({
      name: req.body.name
    }, function(err, racialProfilingCitation) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created racial profiling citation');
          res.redirect('/racial-profiling-citations');
        },
        json: function() {
          res.json(racialProfilingCitation);
        }
      });
    });
  }

  function show(req, res, next) {
    RacialProfilingCitation.findById(req.params.id, function(err, racialProfilingCitation) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingCitation) {
        return next(new Error('Racial profiling citation does not exist'));
      }

      res.format({
        html: function() {
          res.render('racial-profiling-citations/show', {
            racialProfilingCitation: racialProfilingCitation
          });
        },
        json: function() {
          res.json(racialProfilingCitation);
        }
      });
    });
  }

  function edit(req, res, next) {
    RacialProfilingCitation.findById(req.params.id, function(err, racialProfilingCitation) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingCitation) {
        return next(new Error('Racial profiling citation does not exist'));
      }

      res.render('racial-profiling-citations/edit', {
        racialProfilingCitation: racialProfilingCitation
      });
    });
  }

  function update(req, res, next) {
    RacialProfilingCitation.findById(req.params.id, function(err, racialProfilingCitation) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingCitation) {
        return next(new Error('Racial profiling citation does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      racialProfilingCitation.name = req.body.name;
      racialProfilingCitation.save(function(err, racialProfilingCitation) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated racial profiling citation');
            res.redirect('/racial-profiling-citations/' + racialProfilingCitation.id);
          },
          json: function() {
            res.json(racialProfilingCitation);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    RacialProfilingCitation.findById(req.params.id, function(err, racialProfilingCitation) {
      if (err) {
        return next(err);
      }

      if (!racialProfilingCitation) {
        return next(new Error('Racial profiling citation does not exist'));
      }

      racialProfilingCitation.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed racial profiling citation');
            res.redirect('/racial-profiling-citations');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: racialProfilingCitation.id,
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
exports['@require'] = [ 'models/racial-profiling-citation' ];
