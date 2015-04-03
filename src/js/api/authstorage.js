goog.provide('pifuxelck.api.AuthTokenStorage');

goog.require('goog.storage.ExpiringStorage');
goog.require('goog.storage.mechanism.HTML5SessionStorage');



/**
 * Persists an authentication token across page refreshes.
 * @constructor
 */
pifuxelck.api.AuthTokenStorage = function() {
};


/** @const @private {string} */
pifuxelck.api.AuthTokenStorage.ID_KEY_ = 'pifuxelck_user_id';


/** @const @private {string} */
pifuxelck.api.AuthTokenStorage.TOKEN_KEY_ = 'pifuxelck_auth_token';


/**
 * Retrieve the authentication token.
 * @return {?string} the authentication token
 */
pifuxelck.api.AuthTokenStorage.prototype.getToken = function() {
  return window.sessionStorage.getItem(
      pifuxelck.api.AuthTokenStorage.TOKEN_KEY_);
};


/**
 * Retrieve the user ID.
 * @return {?string}
 */
pifuxelck.api.AuthTokenStorage.prototype.getId = function() {
  return window.sessionStorage.getItem(
      pifuxelck.api.AuthTokenStorage.ID_KEY_);
};


/**
 * Store an authentication token in persistent storage.
 * @param {string} token the authentication token
 */
pifuxelck.api.AuthTokenStorage.prototype.setToken = function(token) {
  return window.sessionStorage.setItem(
      pifuxelck.api.AuthTokenStorage.TOKEN_KEY_,
      token);
};


/**
 * Store the user id in persistent storage.
 * @param {string} id the user id
 */
pifuxelck.api.AuthTokenStorage.prototype.setId = function(id) {
  return window.sessionStorage.setItem(
      pifuxelck.api.AuthTokenStorage.ID_KEY_,
      id);
};
