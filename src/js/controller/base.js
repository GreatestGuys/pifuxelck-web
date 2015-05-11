goog.provide('pifuxelck.controller.BaseController');

goog.require('pifuxelck.api');
goog.require('pifuxelck.api.Api');
goog.require('pifuxelck.api.AuthTokenStorage');
goog.require('pifuxelck.data.DataStore');



/**
 * @param {boolean=} opt_allowLoggedOut
 * @constructor
 */
pifuxelck.controller.BaseController = function(opt_allowLoggedOut) {

  /** @private {pifuxelck.api.Api} */
  this.api_ = pifuxelck.api.newApi();

  /** @private {pifuxelck.data.DataStore} */
  this.dataStore_ = new pifuxelck.data.DataStore();

  /** @private {pifuxelck.api.AuthTokenStorage} */
  this.authStore_ = new pifuxelck.api.AuthTokenStorage();

  if (!opt_allowLoggedOut && !this.api_.loggedIn()) {
    window.location = 'index.html';
  }
};


/**
 * @return {pifuxelck.api.Api}
 */
pifuxelck.controller.BaseController.prototype.getApi = function() {
  return this.api_;
};


/**
 * @return {pifuxelck.api.AuthTokenStorage}
 */
pifuxelck.controller.BaseController.prototype.getAuthStore = function() {
  return this.authStore_;
};


/**
 * @return {pifuxelck.data.DataStore}
 */
pifuxelck.controller.BaseController.prototype.getDataStore = function() {
  return this.dataStore_;
};
