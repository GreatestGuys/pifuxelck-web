goog.provide('pifuxelck.controller.IndexController');

goog.require('pifuxelck.api');
goog.require('pifuxelck.controller.BaseController');



/**
 * @constructor
 * @extends {pifuxelck.controller.BaseController}
 */
pifuxelck.controller.IndexController = function() {
  pifuxelck.controller.BaseController.call(this, true);

  /** @private {Element} */
  this.userInput_ = document.getElementById('username');

  /** @private {Element} */
  this.passwordInput_ = document.getElementById('password');

  /** @private {Element} */
  this.loginButton_ = document.getElementById('login');
  this.loginButton_.onclick = goog.bind(this.login_, this);

  /** @private {Element} */
  this.joinButton_ = document.getElementById('join');
  this.joinButton_.onclick = goog.bind(this.join_, this);
};
goog.inherits(
    pifuxelck.controller.IndexController,
    pifuxelck.controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.IndexController',
    pifuxelck.controller.IndexController);


pifuxelck.controller.IndexController.prototype.login_ = function() {
  var goInbox = function() {window.location = 'inbox.html';}
  var showError = function() {alert("Wrong username or password.")};
  this.getApi()
    .login(this.userInput_.value, this.passwordInput_.value)
    .then(goInbox, showError);
};


pifuxelck.controller.IndexController.prototype.join_ = function() {
  var goLogin = goog.bind(this.login_, this);
  var showError = function() {alert("Invalid user name or password.")};
  this.getApi()
    .registerAccount(this.userInput_.value, this.passwordInput_.value)
    .then(goLogin, showError);
};
