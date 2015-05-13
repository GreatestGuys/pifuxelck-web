goog.provide('pifuxelck.controller.LabelController');

goog.require('goog.Uri');
goog.require('pifuxelck.controller.BaseController');
goog.require('pifuxelck.data.DataStore');
goog.require('pifuxelck.ui.Drawing');
goog.require('pifuxelck.ui.soy.game');
goog.require('soy');


goog.scope(function() {

var controller = pifuxelck.controller;
var data = pifuxelck.data;
var ui = pifuxelck.ui;



/**
 * @constructor
 * @extends {controller.BaseController}
 */
controller.LabelController = function() {
  controller.BaseController.call(this);

  /** @private {Element} */
  this.labelInput_ = document.getElementById('label');

  /** @private {Element} */
  this.drawingDiv_ = document.getElementById('drawing');

  var uri = new goog.Uri(window.location.href);
  /** @private {number} */
  this.gameId_ = parseInt(uri.getQueryData().get('game'), 10);

  document.getElementById('fab').onclick = goog.bind(this.onFabClick_, this);

  this.loadInboxEntry_();
};
goog.inherits(controller.LabelController, controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.LabelController',
    controller.LabelController);


controller.LabelController.prototype.loadInboxEntry_ = function() {
  this.getApi()
      .inbox(this.gameId_ + '')
      .then(goog.bind(function(entries) {
        if (entries.length == 0) {
          return;
        }

        var entry = entries[0];
        var previousTurn = entry['previous_turn'];
        if (!previousTurn['is_drawing']) {
          return;
        }

        this.renderDrawing_(previousTurn['drawing']);
      }, this));
};


controller.LabelController.prototype.renderDrawing_ = function(drawing) {
  var uiDrawing = new pifuxelck.ui.Drawing(this.drawingDiv_);
  uiDrawing.setDrawing(drawing);
  uiDrawing.updateCanvas();
};


controller.LabelController.prototype.onFabClick_ = function() {
  var onSuccess = function() {
    window.location.href = 'inbox.html';
  };
  var onFailure = function() {
    alert('Unable to submit turn at this time.');
  };
  this.getApi()
    .move(this.gameId_, data.newLabelTurn(this.labelInput_.value))
    .then(onSuccess, onFailure, this);
};

});

