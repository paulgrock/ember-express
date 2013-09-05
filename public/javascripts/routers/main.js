define([
  'jquery'
], function (jquery) {
  'use strict';
  var app = {};

  return {
    setupPushState: function(){
      App.Router.reopen({
        location: 'history'
      });
    },
    map: function(){
      App.Router.map(function(){
        this.resource('about');
        this.resource('posts', function(){
          this.resource('post', { path: ':post_id' });
        });
      })
    }
  };
});
