goog.provide('pifuxelck.controller.BaseController');

goog.require('pifuxelck.api');
goog.require('pifuxelck.api.Api');



/**
 * @param {boolean=} opt_allowLoggedOut
 * @constructor
 */
pifuxelck.controller.BaseController = function(opt_allowLoggedOut) {

  /** @private {pifuxelck.api.Api} */
  this.api_ = pifuxelck.api.newApi();

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
