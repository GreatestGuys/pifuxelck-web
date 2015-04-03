goog.provide('pifuxelck.ui.Drawing');

goog.require('pifuxelck.data.Game');
goog.require('pifuxelck.ui.graphics');
goog.require('goog.dom');
goog.require('goog.dom.classlist');


goog.scope(function() {
var data = pifuxelck.data;
var graphics = pifuxelck.ui.graphics;
var ui = pifuxelck.ui;


/**
 * @param {Element} container A DOM element that will contain the canvas.
 * @constructor
 */
ui.Drawing = function(container) {

  /** @private {!graphics.Canvas} */
  this.canvas_ = new graphics.Canvas(container);

  /** @private {data.Game} */
  this.drawing_ = undefined;

  /** @private {data.Line} */
  this.line_ = undefined;
};


/**
 * Set the drawing
 * @param {data.Drawing} drawing
 */
ui.Drawing.prototype.setDrawing = function(drawing) {
  this.drawing_ = drawing;
};


/**
 * Set the in progress line.
 * @param {data.Line} line
 */
ui.Drawing.prototype.setLine = function(line) {
  this.line_ = line;
};


/**
 * Update the canvas.
 */
ui.Drawing.prototype.updateCanvas = function() {
  this.canvas_.rescale();

  if (this.drawing_ && this.drawing_['background_color']) {
    this.canvas_.setFillColor(this.drawing_['background_color']);
    var width = this.canvas_.getWidth();
    var height = this.canvas_.getHeight();
    this.canvas_.getContext().fillRect(0, 0, width, height);

    var lines = this.drawing_['lines'];
    for (var i = 0; i < lines.length; ++i) {
      this.drawLine_(lines[i]);
    }
  }

  if (this.line_) {
    this.drawLine_(this.line_);
  }

  this.canvas_.flip();
};


/**
 * Draw a single line.
 * @param {data.Line} line
 * @private
 */
ui.Drawing.prototype.drawLine_ = function(line) {
  var context = this.canvas_.getContext();
  var canvasSize = this.canvas_.getWidth();

  var lineColor = line['color'];
  var lineSize = line['size'];

  this.canvas_.setFillColor(lineColor);
  this.canvas_.setStrokeColor(lineColor);
  context.lineWidth = lineSize * canvasSize;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  var points = line['points'];

  if (points.length == 0) {
    return;
  }

  // Draw a circle over the first point. If this isn't done, then lines of a
  // single point will not be rendered.
  context.beginPath();
  context.arc(
      points[0]['x'] * canvasSize,
      points[0]['y'] * canvasSize,
      lineSize / 2 * canvasSize,
      0,
      2 * Math.PI);
  context.fill();

  context.beginPath();
  for (var i = 0; i < points.length; i++) {
    if (i == 0) {
      context.moveTo(
          points[i]['x'] * canvasSize,
          points[i]['y'] * canvasSize);
    }
    context.lineTo(
        points[i]['x'] * canvasSize,
        points[i]['y'] * canvasSize);
  }
  context.stroke();
};

});
