goog.provide('pifuxelck.ui.graphics');
goog.provide('pifuxelck.ui.graphics.Cavas');
goog.provide('pifuxelck.ui.graphics.Color');

goog.require('goog.dom');
goog.require('goog.dom.classlist');



/**
 * A dictionary that contains a 0 to 1 floating point value for each of the red,
 * green and blue channels of a color.
 * @export
 * @typedef {{
 *    red: number,
 *    green: number,
 *    blue: number,
 *    alpha: number
 * }}
 */
pifuxelck.ui.graphics.Color;


/**
 * Create a new color object.
 * @param {number} red the red component
 * @param {number} green the green component
 * @param {number} blue the blue component
 * @param {number} alpha the alpha component
 * @return {!pifuxelck.ui.graphics.Color}
 */
pifuxelck.ui.graphics.newColor = function(red, green, blue, alpha) {
  return {'red': red, 'green': green, 'blue': blue, 'alpha': alpha};
};


/**
 * An abstraction over an HTML5 canvas that allows for double buffering.
 * @param {Element} container A DOM element that will contain the canvas.
 * @constructor
 */
pifuxelck.ui.graphics.Canvas = function(container) {
  /** @private {Element} */
  this.container_ = container;


  /** @private {HTMLCanvasElement} */
  this.frontBuffer_ =
      /** @type {HTMLCanvasElement} */ (goog.dom.createDom('canvas', {
        'class': 'fullScreen frontBuffer'
      }));


  /** @private {HTMLCanvasElement} */
  this.backBuffer_ =
      /** @type {HTMLCanvasElement} */ (goog.dom.createDom('canvas', {
        'class': 'fullScreen backBuffer'
      }));

  // Add the canvases to the container element.
  this.container_.appendChild(this.frontBuffer_);
  this.container_.appendChild(this.backBuffer_);

  // Rescale the canvases so that they have the same dimensions as the
  // container.
  this.rescaleBuffer_(this.frontBuffer_);
  this.rescaleBuffer_(this.backBuffer_);
};


/**
 * Swap buffers so that the back buffer becomes visible, and the front buffer
 * becomes the back buffer.
 */
pifuxelck.ui.graphics.Canvas.prototype.flip = function() {
  // Use a three stage flip where the z-index of the front buffer is lowered,
  // and the back buffer is raised before hiding the front buffer. This will
  // ensure that there is no flickering when the buffers are flipped as at least
  // one buffer is visible at all times.
  goog.dom.classlist.swap(this.frontBuffer_, 'frontBuffer', 'midBuffer');
  goog.dom.classlist.swap(this.backBuffer_, 'backBuffer', 'frontBuffer');
  goog.dom.classlist.swap(this.frontBuffer_, 'midBuffer', 'backBuffer');

  var newBackBuffer = this.frontBuffer_;
  this.frontBuffer_ = this.backBuffer_;
  this.backBuffer_ = newBackBuffer;

  // Rescale the new back buffer to account for any changes in screen size. This
  // will also have the side effect of clearing the buffer.
  this.rescale();
};


/**
 * Returns the back buffer canvas context that is safe to draw to.
 * @return {CanvasRenderingContext2D} A context that can be drawn to.
 */
pifuxelck.ui.graphics.Canvas.prototype.getContext = function() {
  return /** @type {CanvasRenderingContext2D} */ (this.backBuffer_.getContext('2d'));
};


/**
 * Rescales the back buffer so that it has a one-to-one pixel ratio with the
 * screen. This method should be called prior to drawing the content of the back
 * buffer.
 */
pifuxelck.ui.graphics.Canvas.prototype.rescale = function() {
  this.rescaleBuffer_(this.backBuffer_);
};


/**
 * Return the width of the drawing buffer.
 * @return {number} The width of the drawing buffer.
 */
pifuxelck.ui.graphics.Canvas.prototype.getWidth = function() {
  return this.backBuffer_.width;
};


/**
 * Return the height of the drawing buffer.
 * @return {number} The height of the drawing buffer.
 */
pifuxelck.ui.graphics.Canvas.prototype.getHeight = function() {
  return this.backBuffer_.height;
};


/**
 * Set the fill color.
 * @param {pifuxelck.ui.graphics.Color} color The fill color.
 */
pifuxelck.ui.graphics.Canvas.prototype.setFillColor = function(color) {
  return this
    .getContext()
    .setFillColor(color.red, color.green, color.blue, color.alpha);
};


/**
 * Set the stroke color.
 * @param {pifuxelck.ui.graphics.Color} color The stroke color.
 */
pifuxelck.ui.graphics.Canvas.prototype.setStrokeColor = function(color) {
  return this
    .getContext()
    .setStrokeColor(color.red, color.green, color.blue, color.alpha);
};


/**
 * Rescales the back buffer so that it has a one-to-one pixel ratio with the
 * screen. As a side-effect of rescaling, the back buffer will also be cleared.
 * @param {HTMLCanvasElement} buffer The buffer to rescale.
 * @private
 */
pifuxelck.ui.graphics.Canvas.prototype.rescaleBuffer_ = function(buffer) {
  buffer.width = this.container_.clientWidth;
  buffer.height = this.container_.clientHeight;
};
