goog.provide('pifuxelck.data.InboxEntry');

goog.require('pifuxelck.data.Turn');


/**
 * @export
 * @typedef {{
 *    game_id: string,
 *    turn:    pifuxelck.data.Turn
 * }}
 */
pifuxelck.data.InboxEntry;


/**
 * Create a new InboxEntry.
 * @param {string} gameId the game id
 * @param {!pifuxelck.data.Turn} turn the turn
 * @return {!pifuxelck.data.InboxEntry}
 */
pifuxelck.data.newInboxEntry = function(gameId, turn) {
  return {
    'game_id': gameId,
    'turn': turn
  };
};
