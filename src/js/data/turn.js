goog.provide('pifuxelck.data.Turn');
goog.provide('pifuxelck.data.TurnType');

goog.require('pifuxelck.data.Drawing');


/**
 * @export
 * @typedef {{
 *    type:     pifuxelck.data.TurnType,
 *    contents: (string|pifuxelck.data.Drawing),
 *    player:   ?string
 * }}
 */
pifuxelck.data.Turn;


/**
 * @export
 * @enum {string}
 */
pifuxelck.data.TurnType = {
  DRAWING: 'drawing',
  LABEL: 'label'
};


/**
 * Create a new drawing turn.
 * @param {pifuxelck.data.Drawing} drawing the drawing
 * @param {string=} opt_player the player who took the turn
 * @return {!pifuxelck.data.Turn}
 */
pifuxelck.data.newDrawingTurn = function(drawing, opt_player) {
  return {
    'type': pifuxelck.data.TurnType.DRAWING,
    'contents': drawing,
    'player': opt_player || null
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
    'type': pifuxelck.data.TurnType.LABEL,
    'contents': label,
    'player': opt_player || null
  };
};
