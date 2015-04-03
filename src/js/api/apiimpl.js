goog.provide('pifuxelck.api.ApiImpl');

goog.require('goog.Promise');
goog.require('goog.net.XhrIo');
goog.require('pifuxelck.api.Api');
goog.require('pifuxelck.api.AuthTokenStorage');
goog.require('pifuxelck.auth.Identity');
goog.require('pifuxelck.data.Game');
goog.require('pifuxelck.data.InboxEntry');
goog.require('pifuxelck.data.Message');
goog.require('pifuxelck.data.Turn');



/**
 * Represents the API that is used to communicate with an abstract backend.
 * @param {pifuxelck.api.AuthTokenStorage} storage The storage mechanism for
 *     persisting an authentication token across multiple page refreshes.
 * @param {string=} opt_protocol the protocol to use
 * @param {string=} opt_host the host of the API server
 * @param {number=} opt_port the port the API server is running on
 * @extends {pifuxelck.api.Api}
 * @constructor
 */
pifuxelck.api.ApiImpl = function(storage, opt_protocol, opt_host, opt_port) {

  /** @private {pifuxelck.api.AuthTokenStorage} */
  this.authTokenStorage_ = storage;

  /** @private {string} */
  this.protocol_ = opt_protocol || 'https:';

  /** @private {string} */
  this.host_ = opt_host || 'api.everythingissauce.com';

  /** @private {number} */
  this.port_ = opt_port || 443;
};
goog.inherits(pifuxelck.api.ApiImpl, pifuxelck.api.Api);


/**
 * Make a call to the API server.
 * @param {string} path the path to request
 * @param {function(!Object, function(!T), function(*))} f the transform to apply
 *     to the body, the first parameter is used to resolve the value, the second
 *     to reject it
 * @param {string=} opt_method the HTTP method to use when making the request
 * @param {Object|Array|string=} opt_body the body of the request
 * @template T
 * @return {!goog.Promise.<!T>}
 */
pifuxelck.api.ApiImpl.prototype.makeApiCall_ =
    function(path, f, opt_method, opt_body) {
  var url = this.protocol_ + '//' + this.host_ + ':' + this.port_ + path;

  var authToken = this.authTokenStorage_.getToken();
  var xhr = new goog.net.XhrIo();
  if (authToken) {
    xhr.headers.set('x-pifuxelck-auth', authToken);
  }

  // If the body is object like (array or object), then stringify it before
  // sending it, otherwise pass it through unchanged.
  var body = goog.isObject(opt_body) ? JSON.stringify(opt_body) : opt_body;

  return new goog.Promise(
      function(resolve, reject) {
        xhr.listen(goog.net.EventType.COMPLETE, function() {
              if (xhr.isSuccess()) {
                var msg = /** @type{pifuxelck.data.Message} */
                    (JSON.parse(xhr.getResponseText()));
                f(msg, resolve, reject);
              } else {
                reject('HTTP Request failed.');
              }
            });
        xhr.send(url, opt_method, body);
      }, this);
};


/** @inheritDoc */
pifuxelck.api.ApiImpl.prototype.loggedIn = function() {
  return !!this.authTokenStorage_.getToken();
}


/** @inheritDoc */
pifuxelck.api.ApiImpl.prototype.logout = function() {
  this.authTokenStorage_.setToken('');
  this.authTokenStorage_.setId(0);
};


/** @inheritDoc */
pifuxelck.api.ApiImpl.prototype.registerAccount = function(name, password) {
  var toIdentity = function(response, resolve, reject) {
    var id = response['user']['id'];
    resolve(new pifuxelck.auth.Identity(id, name));
  };
  var body = {'user': {'display_name': name, 'password': password}};
  return this.makeApiCall_('/api/2/account/register', toIdentity, 'POST', body);
}


/** @inheritDoc */
pifuxelck.api.ApiImpl.prototype.login = function(name, password) {
  var saveAuthToken = goog.bind(function(response, resolve, reject) {
    var authToken = response['meta']['auth'];
    var id = response['user']['id'];
    this.authTokenStorage_.setId(id);
    this.authTokenStorage_.setToken(authToken);
    resolve(authToken);
  }, this);
  var body = {'user': {'display_name': name, 'password': password}};
  return this.makeApiCall_('/api/2/account/login', saveAuthToken, 'POST', body);
};


/** @inheritDoc */
pifuxelck.api.ApiImpl.prototype.lookupUserId = function(displayName) {
  return this.makeApiCall_(
      '/api/2/contacts/lookup/' + displayName,
      function(response, resolve, reject) {
        resolve(parseInt(response['user']['id'], 10));
      });
};


/**
 * Creates a new game.
 * @param {string} label the initial label
 * @param {!Array<number>} players a list IDs of players that are to be included in the game
 * @return {goog.Promise} a future that resolves if the game was created
 */
pifuxelck.api.ApiImpl.prototype.newGame = function(label, players) {
  var body = {'new_game': {'label': label, 'players': players}};
  return this.makeApiCall_(
      '/api/2/games/new',
      function(response, resolve, reject) {resolve(response);},
      'POST',
      body);
};


/**
 * Queries the current logged in user's inbox.
 * @return {goog.Promise.<Array.<pifuxelck.data.InboxEntry>>} the list of all
 *     current entries in a user's inbox
 */
pifuxelck.api.ApiImpl.prototype.inbox = function() {
  return this.makeApiCall_(
      '/api/2/games/inbox',
      function(response, resolve, reject) {resolve(response['inbox_entries']);});
};


/**
 * Submit a turn for an active game.
 * @param {number} gameId the ID of the game
 * @param {!pifuxelck.data.Turn} turn the turn that is to be submitted. It is not necessary for
 *             the player ID of the turn to be filled in as it will be
 *             inferred by the logged in state of the user.
 * @return {!goog.Promise} a future that resolves if submitting the move succeeded
 */
pifuxelck.api.ApiImpl.prototype.move = function(gameId, turn) {
  var body = {'turn': turn};
  return this.makeApiCall_(
      '/api/2/games/play/' + gameId,
      function(response, resolve, reject) {resolve(response);},
      'POST',
      body);
}


/**
 * Retrieve a list of games that occurred after the given timestamp.
 * @param startTimeId The completed_at_id of the last game.
 * @return {!goog.Promise.<Array.<pifuxelck.data.Game>>} the list of completed
 *     games
 */
pifuxelck.api.ApiImpl.prototype.history = function(startTimeId) {
  return this.makeApiCall_(
      '/api/2/games/since/' + startTimeId,
      function(response, resolve, reject) {resolve(response['games']);});
};
