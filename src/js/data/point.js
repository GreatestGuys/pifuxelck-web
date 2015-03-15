goog.provide('pifuxelck.data.Point');


/**
 * @export
 * @typedef {{
 *    x: number,
 *    y: number
 * }}
 */
pifuxelck.data.Point;


/**
 * Create a new Point.
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @return {!pifuxelck.data.Point}
 */
pifuxelck.data.newPoint = function(x, y) {
  return {'x': x, 'y': y};
};
