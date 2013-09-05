require.config({
  baseUrl: '/javascripts',
  paths: {
    jquery: '../vendor/jquery/jquery',
    lodash: '../vendor/lodash/dist/lodash.compat',
    ember: '../vendor/ember/ember',
    requirejs: '../vendor/requirejs/require',
    handlebars: '../vendor/handlebars/handlebars',
    showdown: '../vendor/showdown/src/showdown',
    moment: '../vendor/moment/moment'
  },
  shim: {
    ember: {
      deps: [
        'jquery',
        'handlebars'
      ],
      exports: 'Ember'
    }
  }
});

//files to include on ALL client side paths
require([
  'ember',
  'routers/main',
  'controllers/post-controller',
  'routes/posts',
  'routes/post',
  'helpers/handlebars'
], function (Ember, router, postController, postsRoute, postRoute, hbs) {
  'use strict';

  window.App = Ember.Application.create();
  router.setupPushState();
  router.map();
  postsRoute.fetch();
  postRoute.fetch();
  postController.start();
  hbs.formatDate();
  hbs.formatMarkdown();
});
