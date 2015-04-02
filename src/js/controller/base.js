goog.provide('pifuxelck.controller.BaseController');

goog.require('pifuxelck.api');
goog.require('pifuxelck.api.Api');



/**
 * @constructor
 */
pifuxelck.controller.BaseController = function() {

  /** @private {pifuxelck.api.Api} */
  this.api_ = pifuxelck.api.newApi();
};


/**
 * @return {pifuxelck.api.Api}
 */
pifuxelck.controller.BaseController.prototype.getApi = function() {
  return this.api_;
};
