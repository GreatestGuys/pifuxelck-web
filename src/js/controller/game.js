goog.provide('pifuxelck.controller.GameController');

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
pifuxelck.controller.GameController = function() {
  controller.BaseController.call(this);

  /** @private {Element} */
  this.grid_ = document.getElementById('grid');

  /** @private {pifuxelck.data.DataStore} */
  this.dataStore_ = new pifuxelck.data.DataStore();

  var uri = new goog.Uri(window.location.href);
  /** @private {number} */
  this.gameId_ = parseInt(uri.getQueryData().get('game'));

  if (this.gameId_) {
    this.dataStore_.withHistory(goog.bind(this.loadGame_, this));
  }
};
goog.inherits(controller.GameController, controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.GameController',
    controller.GameController);


controller.GameController.prototype.loadGame_ = function(db) {
  db.get(this.gameId_).then(goog.bind(function(game) {
    var turns = game['turns'];
    for (var i = 0; i < turns.length; ++i) {
      if (turns[i]['is_drawing']) {
        this.renderDrawing_(turns[i]);
      } else {
        this.renderLabel_(turns[i]);
      }
    }
  }, this));
};


controller.GameController.prototype.renderDrawing_ = function(turn) {
  var fragment = soy.renderAsFragment(ui.soy.game.drawingTurn, turn);
  var uiDrawing = new pifuxelck.ui.Drawing(fragment.children[0]);
  this.grid_.appendChild(fragment);
  uiDrawing.setDrawing(turn['drawing']);
  uiDrawing.updateCanvas();
};


controller.GameController.prototype.renderLabel_ = function(turn) {
  var fragment = soy.renderAsFragment(ui.soy.game.labelTurn, turn);
  this.grid_.appendChild(fragment);
};

});
