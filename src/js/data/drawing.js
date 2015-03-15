goog.provide('pifuxelck.data.Drawing');

goog.require('pifuxelck.data.Line');
goog.require('pifuxelck.ui.graphics.Color');


/**
 * @export
 * @typedef {{
 *    background_color: !pifuxelck.ui.graphics.Color,
 *    lines:            !Array.<pifuxelck.data.Line>
 * }}
 */
pifuxelck.data.Drawing;


/**
 * Create a new empty drawing.
 * @return {!pifuxelck.data.Drawing}
 */
pifuxelck.data.newEmptyDrawing = function() {
  return {
    'background_color': {'red': 1, 'green': 1, 'blue': 1, 'alpha': 1},
    'lines': []
  };
};
