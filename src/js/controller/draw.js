goog.provide('pifuxelck.controller.DrawController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('pifuxelck.controller.BaseController');
goog.require('pifuxelck.data.DataStore');
goog.require('pifuxelck.ui.Drawing');
goog.require('pifuxelck.ui.graphics');
goog.require('pifuxelck.ui.soy.draw');
goog.require('soy');


goog.scope(function() {
var controller = pifuxelck.controller;
var data = pifuxelck.data;
var ui = pifuxelck.ui;


var newColor = function(r, g, b) {
  return ui.graphics.newColor(r / 255, g / 255, b / 255, 1);
};



/**
 * @constructor
 * @extends {pifuxelck.controller.BaseController}
 */
controller.DrawController = function() {
  controller.BaseController.call(this);

  /** @private {!Element} */
  this.drawingDiv_ = document.getElementById('drawing');

  /** @private {!Element} */
  this.overlayDiv_ = document.getElementById('overlay');

  /** @private {!data.Drawing} */
  this.drawing_ = data.newEmptyDrawing();

  /** @private {!ui.Drawing} */
  this.drawingUi_ = new ui.Drawing(this.drawingDiv_);
  this.drawingUi_.setDrawing(this.drawing_);

  /** @private {!data.Color} */
  this.strokeColor_ = ui.graphics.newColor(0, 0, 0, 1);

  /** @private {!data.Color} */
  this.strokeSize_ = 0.0125;

  /** @private {data.Line} */
  this.inProgressLine_ = undefined;

  var uri = new goog.Uri(window.location.href);
  /** @private {number} */
  this.gameId_ = parseInt(uri.getQueryData().get('game'));

  document.getElementById('size-button').onclick =
    goog.bind(this.showSizes_, this);

  document.getElementById('color-button').onclick =
    goog.bind(this.showStrokeColors_, this);

  document.getElementById('background-button').onclick =
    goog.bind(this.showBackgroundColors_, this);

  document.getElementById('undo-button').onclick =
    goog.bind(this.undo_, this);

  document.getElementById('fab-button').onclick =
    goog.bind(this.onFabClick_, this);

  this.drawingDiv_.onmousedown = goog.bind(this.onMouseDown_, this);
  document.onmousemove = goog.bind(this.onMouseMove_, this);
  document.onmouseup = goog.bind(this.onMouseUp_, this);
  window.onresize = goog.bind(this.onResize_, this);

  document.onmousedown = function() {return false;}
};
goog.inherits(controller.DrawController, controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.DrawController',
    controller.DrawController);


controller.DrawController.SIZES_ = [
    0.0125, 0.025, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.6
];


controller.DrawController.COLORS_ = [
  // Black, greys, and white:
  newColor(0, 0, 0), newColor(190, 190, 190), newColor(167, 167, 167),
  newColor(220, 220, 220), newColor(248, 248, 255), newColor(255, 255, 255),

  // Blues:
  newColor(25, 25, 112), newColor(0, 0, 255), newColor(64, 105, 255),
  newColor(0, 191, 255), newColor(135, 206, 235), newColor(173, 216, 230),

  // Greens:
  newColor(0, 100, 0), newColor(107, 142, 35), newColor(0, 128, 0),
  newColor(46, 139, 87), newColor(60, 179, 113), newColor(0, 255, 127),

  // Yellows:
  newColor(184, 134, 11), newColor(255, 140, 0), newColor(255, 165, 0),
  newColor(255, 255, 0), newColor(238, 232, 170), newColor(250, 250, 210),

  // Reds:
  newColor(178, 34, 34), newColor(165, 42, 42), newColor(205, 92, 92),
  newColor(250, 128, 114), newColor(255, 160, 122), newColor(255, 228, 181),

  // Oranges:
  newColor(128, 0, 0), newColor(210, 105, 30), newColor(255, 0, 0),
  newColor(255, 99, 71), newColor(244, 164, 96), newColor(245, 222, 179),

  // Purples:
  newColor(139, 0, 139), newColor(208, 32, 144), newColor(255, 20, 147),
  newColor(255, 0, 255), newColor(219, 112, 147), newColor(255, 182, 193)
];


controller.DrawController.prototype.onFabClick_ = function() {
  var onSuccess = function() {
    window.location.href = 'inbox.html';
  };
  var onFailure = function() {
    alert('Unable to submit turn at this time.');
  };
  this.getApi()
    .move(this.gameId_, data.newDrawingTurn(this.drawing_))
    .then(onSuccess, onFailure, this);
};


controller.DrawController.prototype.showOverlay_ = function() {
  goog.dom.removeChildren(this.overlayDiv_);
  goog.dom.classes.remove(this.overlayDiv_, 'drawing-overlay-hidden');
};


controller.DrawController.prototype.hideOverlay_ = function() {
  goog.dom.removeChildren(this.overlayDiv_);
  goog.dom.classes.add(this.overlayDiv_, 'drawing-overlay-hidden');
};


controller.DrawController.prototype.showStrokeColors_ = function() {
  this.showOverlay_();
  this.showColors_(goog.bind(function(color) {
    this.strokeColor_ = color;
  }, this));
};


controller.DrawController.prototype.showBackgroundColors_ = function() {
  this.showOverlay_();
  this.showColors_(goog.bind(function(color) {
    this.drawing_['background_color'] = color;
    this.drawingUi_.updateCanvas();
  }, this));
};


controller.DrawController.prototype.showSizes_ = function() {
  this.showOverlay_();

  for (var i = 0; i < controller.DrawController.SIZES_.length; ++i) {
    goog.bind(function(size) {
      var fragment = soy.renderAsFragment(ui.soy.draw.sizeButton, {
        'size': size * 100
      });
      this.overlayDiv_.appendChild(fragment);
      fragment.onclick = goog.bind(function() {
        this.strokeSize_ = size;
        this.hideOverlay_();
      }, this);
    }, this)(controller.DrawController.SIZES_[i]);
  }
};


controller.DrawController.prototype.showColors_ = function(callback) {
  this.showOverlay_();

  for (var i = 0; i < controller.DrawController.COLORS_.length; ++i) {
    goog.bind(function(color) {
      var fragment = soy.renderAsFragment(ui.soy.draw.colorButton, {
        'color': ui.graphics.colorToStyle(color)
      });
      this.overlayDiv_.appendChild(fragment);
      fragment.onclick = goog.bind(function() {
        callback(color);
        this.hideOverlay_();
      }, this);
    }, this)(controller.DrawController.COLORS_[i]);
  }
};


controller.DrawController.prototype.onMouseDown_ = function(e) {
  // If there is currently a line in progress then the previous mouse up got
  // lost, instead just pretend that this is a mouse up event.
  if (this.inProgressLine_) {
    this.onMouseUp_(e);
    return false;
  }

  this.inProgressLine_ = data.newEmptyLine(this.strokeColor_, this.strokeSize_);
  this.drawingUi_.setLine(this.inProgressLine_);
  this.onMouseMove_(e);
  return false;
};


controller.DrawController.prototype.undo_ = function(e) {
  this.drawing_['lines'].pop();
  this.drawingUi_.updateCanvas();
};


controller.DrawController.prototype.onMouseUp_ = function(e) {
  if (this.inProgressLine_ == undefined) {
    return;
  }

  this.drawing_['lines'].push(this.inProgressLine_);
  this.inProgressLine_ = undefined;

  this.drawingUi_.setLine(undefined);
  this.drawingUi_.updateCanvas();
};


controller.DrawController.prototype.onMouseMove_ = function(e) {
  if (this.inProgressLine_ == undefined) {
    return;
  }

  // TODO: filter out coordinates that are too close the last set of points.

  var boundingBox = this.drawingDiv_.getBoundingClientRect();
  var size = boundingBox.width;
  var x = (e.x - boundingBox.left) / size;
  var y = (e.y - boundingBox.top) / size;
  this.inProgressLine_['points'].push(data.newPoint(x, y));
  this.drawingUi_.updateCanvas();
};


controller.DrawController.prototype.onResize_ = function() {
  this.drawingUi_.updateCanvas();
};


});
