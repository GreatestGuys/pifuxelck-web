goog.provide('pifuxelck.controller.InboxController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('pifuxelck.api');
goog.require('pifuxelck.controller.BaseController');
goog.require('pifuxelck.data.User');
goog.require('pifuxelck.ui.Drawing');
goog.require('pifuxelck.ui.soy.inbox');



/**
 * @constructor
 */
pifuxelck.controller.InboxController = function() {
  pifuxelck.controller.BaseController.call(this);

  /** @private {Element} */
  this.inboxList_ = document.getElementById('grid');

  this.loadInbox_();
};
goog.inherits(
    pifuxelck.controller.InboxController,
    pifuxelck.controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.InboxController',
    pifuxelck.controller.InboxController);


pifuxelck.controller.InboxController.prototype.loadInbox_ = function() {
  this.getApi()
    .inbox()
    .then(goog.bind(function(inboxEntries) {
      goog.dom.removeChildren(this.inboxList_);

      for (var i = 0; i < inboxEntries.length; ++i) {
        this.renderEntry_(inboxEntries[i]);
      }
    }, this));
};


pifuxelck.controller.InboxController.prototype.renderEntry_ = function(entry) {
  var gameId = entry['game_id'];
  var previousTurn = entry['previous_turn'];
  if (previousTurn['is_drawing']) {
    this.renderDrawing_(gameId, previousTurn);
  } else {
    this.renderLabel_(gameId, previousTurn);
  }
};


pifuxelck.controller.InboxController.prototype.renderDrawing_ = function(
    gameId,
    drawingTurn) {
  var fragment = soy.renderAsFragment(
      pifuxelck.ui.soy.inbox.drawing,
      {'gameId': gameId});
  this.inboxList_.appendChild(fragment);

  var drawingDiv = goog.dom.getElementByClass(fragment, 'grid-element-drawing');
  var drawing = new pifuxelck.ui.Drawing(drawingDiv);
  drawing.setDrawing(drawingTurn['drawing']);
  drawing.updateCanvas();
};


pifuxelck.controller.InboxController.prototype.renderLabel_ = function(
    gameId,
    labelTurn) {
  var fragment = soy.renderAsFragment(
      pifuxelck.ui.soy.inbox.label,
      {'gameId': gameId, 'label': labelTurn['label']});
  this.inboxList_.appendChild(fragment);
};
