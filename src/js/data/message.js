goog.provide('pifuxelck.data.Message');

goog.require('pifuxelck.data.Game');
goog.require('pifuxelck.data.InboxEntry');


/**
 * @typedef{{
 *  user: {
 *    id:           number,
 *    display_name: string,
 *    password:     string
 *  },
 *  meta: {
 *    auth: string
 *  },
 *  new_game: {
 *    label:   string,
 *    players: Array.<number>
 *  },
 *  inbox_entrise: Array.<!pifuxelck.data.InboxEntry>,
 *  games: Array.<!pifuxelck.data.Game>
 * }}
 */
pifuxelck.data.Message;
