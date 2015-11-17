
// app - routes - body cam meta

var express = require('express');

exports = module.exports = function(IoC) {

  var app = this;
  var router = express.Router();
  var controller = IoC.create('controllers/body-cam-metas');

  router.get(
    '/',
    controller.index
  );

  router.get(
    '/new',
    controller.new
  );

  router.post(
    '/',
    controller.create
  );

  router.get(
    '/:id',
    controller.show
  );

  router.get(
    '/:id/edit',
    controller.edit
  );

  router.put(
    '/:id',
    controller.update
  );

  router.delete(
    '/:id',
    controller.destroy
  );

  app.use(
    '/body-cam-metas',
    router
  );

};

exports['@require'] = [ '$container' ];
exports['@singleton'] = true;
