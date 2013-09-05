define([
], function () {
  'use strict';
  return {
    start: function(){
      App.PostController = Ember.ObjectController.extend({
        isEditing: false,
        actions: {
          edit: function(){
            this.set('isEditing', true);
          },
          doneEditing: function(){
            this.set('isEditing', false);
          }
        }
      });
    }
  }
});
