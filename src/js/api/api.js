goog.provide('pifuxelck.api.Api');

goog.require('goog.Promise');
goog.require('pifuxelck.Identity');
goog.require('pifuxelck.data.Game');
goog.require('pifuxelck.data.InboxEntry');
goog.require('pifuxelck.data.Turn');



/**
 * Represents the API that is used to communicate with an abstract backend.
 * @constructor
 */
pifuxelck.api.Api = function() {
};


/**
 * Synchronously determine if the API has an authentication token. Having an
 * authentication token allows the API instance to make requests that require
 * the user to be logged in.
 * @return {boolean} a boolean indicating if the API is currently logged in
 */
pifuxelck.api.Api.prototype.loggedIn = goog.abstractMethod;


/**
 * Registers a partial identity with the server.
 * @param {string} displayName the display name to register
 * @return {!goog.Promise.<!pifuxelck.Identity>} the registered user
 */
pifuxelck.api.Api.prototype.registerAccount = goog.abstractMethod;


/**
 * Attempts to login and obtain an authentication token.
 * @param {pifuxelck.Identity} identity the identity of the current user
 * @return {!goog.Promise.<string>}the authentication token
 */
pifuxelck.api.Api.prototype.login = goog.abstractMethod;


/**
 * Attempt to resolve the user ID of a given display name.
 * @param {string} displayName the display name of the user to lookup
 * @return {!goog.Promise<number>} the user ID of the given display name
 */
pifuxelck.api.Api.prototype.lookupUserId = goog.abstractMethod;


/**
 * Creates a new game.
 * @param {string} label the initial label
 * @param {!Array<number>} players a list IDs of players that are to be included in the game
 * @return {goog.Promise} a future that resolves if the game was created
 */
pifuxelck.api.Api.prototype.newGame = goog.abstractMethod;


/**
 * Queries the current logged in user's inbox.
 * @return {goog.Promise.<Array.<pifuxelck.data.InboxEntry>>} the list of all
 *     current entries in a user's inbox
 */
pifuxelck.api.Api.prototype.inbox = goog.abstractMethod;


/**
 * Submit a turn for an active game.
 * @param {number} gameId the ID of the game
 * @param {!pifuxelck.data.Turn} turn the turn that is to be submitted. It is not necessary for
 *             the player ID of the turn to be filled in as it will be
 *             inferred by the logged in state of the user.
 * @return {!goog.Promise} a future that resolves if submitting the move succeeded
 */
pifuxelck.api.Api.prototype.move = goog.abstractMethod;


/**
 * Retrieve a list of games that occurred after the given timestamp.
 * @param startTimeSeconds The unix timestamp to begin querying games at.
 * @return {!goog.Promise.<Array.<pifuxelck.data.Game>>} the list of completed
 *     games
 */
pifuxelck.api.Api.history = goog.abstractMethod;
