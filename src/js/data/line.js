goog.provide('pifuxelck.data.Line');

goog.require('pifuxelck.data.Point');
goog.require('pifuxelck.ui.graphics.Color');


/**
 * @export
 * @typedef {{
 *    color:  !pifuxelck.ui.graphics.Color,
 *    points: !Array.<pifuxelck.data.Point>,
 *    size:   number
 * }}
 */
pifuxelck.data.Line;


/**
 * Create a new empty line.
 * @param {!pifuxelck.ui.graphics.Color} color the stroke color of the line
 * @param {number} size the stroke size
 * @return {!pifuxelck.data.Line}
 */
pifuxelck.data.newEmptyLine = function(color, size) {
  return {'color': color, 'points': [], 'size': size};
};
