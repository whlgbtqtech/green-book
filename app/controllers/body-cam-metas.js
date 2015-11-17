
// # body cam meta

var _ = require('underscore');
var _str = require('underscore.string');
_.mixin(_str.exports());

var paginate = require('express-paginate');

exports = module.exports = function(BodyCamMeta) {

  function index(req, res, next) {
    BodyCamMeta.paginate({}, req.query.page, req.query.limit, function(err, pageCount, bodyCamMetas, itemCount) {
      if (err) {
        return next(err);
      }

      res.format({
        html: function() {
          res.render('body-cam-metas', {
            bodyCamMetas: bodyCamMetas,
            pageCount: pageCount,
            itemCount: itemCount
          });
        },
        json: function() {
          // inspired by Stripe's API response for list objects
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount, bodyCamMetas.length),
            data: bodyCamMetas
          });
        }
      });
    });
  }

  function _new(req, res, next) {
    res.render('body-cam-metas/new');
  }

  function create(req, res, next) {
    if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
      return next({
        param: 'name',
        message: 'Name is missing or blank'
      });
    }

    BodyCamMeta.create({
      name: req.body.name
    }, function(err, bodyCamMeta) {
      if (err) {
        return next(err); 
      }

      res.format({
        html: function() {
          req.flash('success', 'Successfully created body cam meta');
          res.redirect('/body-cam-metas');
        },
        json: function() {
          res.json(bodyCamMeta);
        }
      });
    });
  }

  function show(req, res, next) {
    BodyCamMeta.findById(req.params.id, function(err, bodyCamMeta) {
      if (err) {
        return next(err);
      }

      if (!bodyCamMeta) {
        return next(new Error('Body cam meta does not exist'));
      }

      res.format({
        html: function() {
          res.render('body-cam-metas/show', {
            bodyCamMeta: bodyCamMeta
          });
        },
        json: function() {
          res.json(bodyCamMeta);
        }
      });
    });
  }

  function edit(req, res, next) {
    BodyCamMeta.findById(req.params.id, function(err, bodyCamMeta) {
      if (err) {
        return next(err);
      }

      if (!bodyCamMeta) {
        return next(new Error('Body cam meta does not exist'));
      }

      res.render('body-cam-metas/edit', {
        bodyCamMeta: bodyCamMeta
      });
    });
  }

  function update(req, res, next) {
    BodyCamMeta.findById(req.params.id, function(err, bodyCamMeta) {
      if (err) {
        return next(err);
      }

      if (!bodyCamMeta) {
        return next(new Error('Body cam meta does not exist'));
      }

      if (!_.isString(req.body.name) || _.isBlank(req.body.name)) {
        return next({
          param: 'name',
          message: 'Name is missing or blank'
        });
      }

      bodyCamMeta.name = req.body.name;
      bodyCamMeta.save(function(err, bodyCamMeta) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully updated body cam meta');
            res.redirect('/body-cam-metas/' + bodyCamMeta.id);
          },
          json: function() {
            res.json(bodyCamMeta);
          }
        });
      });
    });
  }

  function destroy(req, res, next) {
    BodyCamMeta.findById(req.params.id, function(err, bodyCamMeta) {
      if (err) {
        return next(err);
      }

      if (!bodyCamMeta) {
        return next(new Error('Body cam meta does not exist'));
      }

      bodyCamMeta.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.format({
          html: function() {
            req.flash('success', 'Successfully removed body cam meta');
            res.redirect('/body-cam-metas');
          },
          json: function() {
            // inspired by Stripe's API response for object removals
            res.json({
              id: bodyCamMeta.id,
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
exports['@require'] = [ 'models/body-cam-meta' ];
