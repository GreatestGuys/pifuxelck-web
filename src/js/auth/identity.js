goog.provide('pifuxelck.auth.Identity');



/**
 * @param {string} accountId
 * @param {string} displayName
 * @constructor
 */
pifuxelck.auth.Identity = function(accountId, displayName) {

  /** @private {string} */
  this.accountId_ = accountId;

  /** @private {string} */
  this.displayName_ = displayName;
};


/** @return {string} */
pifuxelck.auth.Identity.prototype.getId = function() {
  return this.accountId_;
};


/** @return {string} */
pifuxelck.auth.Identity.prototype.getDisplayName = function() {
  return this.displayName_;
};
