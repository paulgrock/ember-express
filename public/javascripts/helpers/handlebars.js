define([
  'ember',
  'moment',
  'showdown'
], function (Ember, moment, showdown) {
  'use strict';
  return {
    formatDate: function(){
      Ember.Handlebars.helper('format-date', function(date){
        return moment(date).fromNow();
      });
    },
    formatMarkdown: function(){
      var showdown = new Showdown.converter();
      Ember.Handlebars.helper('format-markdown', function(input){
        return new Handlebars.SafeString(showdown.makeHtml(input));
      });
    }
  };
});
