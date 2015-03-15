goog.provide('pifuxelck.data.Game');

goog.require('pifuxelck.data.Turn');


/**
 * @export
 * @typedef {{
 *    completed_at: number,
 *    game_id:      string,
 *    turns:        !Array.<pifuxelck.data.Turn>
 * }}
 */
pifuxelck.data.Game;


/**
 * Create a new game.
 * @param {number} completedAt the completed at ID
 * @param {number} gameId the game ID
 * @param {!Array.<!pifuxelck.data.Turn>} turns the turns of the game in order
 */
pifuxelck.data.newGame = function(completedAt, gameId, turns) {
  return {'completed_at': completedAt, 'game_id': gameId, 'turns': turns};
};
