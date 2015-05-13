goog.provide('pifuxelck.data.Turn');
goog.provide('pifuxelck.data.TurnType');

goog.require('pifuxelck.data.Drawing');


/**
 * @export
 * @typedef {{
 *    is_drawing: boolean,
 *    drawing:    ?pifuxelck.data.Drawing,
 *    label:      ?string,
 *    player:     ?string
 * }}
 */
pifuxelck.data.Turn;


/**
 * Create a new drawing turn.
 * @param {pifuxelck.data.Drawing} drawing the drawing
 * @param {string=} opt_player the player who took the turn
 * @return {!pifuxelck.data.Turn}
 */
pifuxelck.data.newDrawingTurn = function(drawing, opt_player) {
  return {
    'is_drawing': true,
    'drawing': drawing,
    'player': opt_player || null,
    'label': null
  };
};


/**
 * Create a new label turn.
 * @param {string} label the label
 * @param {string=} opt_player the player who took the turn
 * @return {!pifuxelck.data.Turn}
 */
pifuxelck.data.newLabelTurn = function(label, opt_player) {
  return {
    'is_drawing': false,
    'label': label,
    'player': opt_player || null,
    'drawing': null
  };
};
