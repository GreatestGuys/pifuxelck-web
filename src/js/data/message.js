goog.provide('pifuxelck.data.Message');

goog.require('pifuxelck.data.Game');
goog.require('pifuxelck.data.InboxEntry');
goog.require('pifuxelck.data.User');


/**
 * @typedef{{
 *  user: pifuxelck.data.User,
 *  meta: {
 *    auth: string
 *  },
 *  new_game: {
 *    label:   string,
 *    players: Array.<number>
 *  },
 *  inbox_entries: Array.<!pifuxelck.data.InboxEntry>,
 *  inbox_entry: !pifuxelck.data.InboxEntry,
 *  games: Array.<!pifuxelck.data.Game>
 * }}
 */
pifuxelck.data.Message;
