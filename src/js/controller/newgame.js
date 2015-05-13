goog.provide('pifuxelck.controller.NewGameController');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('pifuxelck.api');
goog.require('pifuxelck.controller.BaseController');
goog.require('pifuxelck.data.User');
goog.require('pifuxelck.ui.soy.newgame');



/**
 * @constructor
 * @extends {pifuxelck.controller.BaseController}
 */
pifuxelck.controller.NewGameController = function() {
  pifuxelck.controller.BaseController.call(this, true);

  /** @private {Element} */
  this.labelInput_ = document.getElementById('label');

  /** @private {Element} */
  this.contactsList_ = document.getElementById('contacts-list');

  /** @private {Element} */
  this.fabButton_ = document.getElementById('fab');
  this.fabButton_.onclick = goog.bind(this.send_, this);

  /** @private {!Array.<string>} */
  this.players_ = [];

  this.loadContacts_();
};
goog.inherits(
    pifuxelck.controller.NewGameController,
    pifuxelck.controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.NewGameController',
    pifuxelck.controller.NewGameController);


pifuxelck.controller.NewGameController.prototype.send_ = function() {
  if (this.labelInput_ == "") {
    alert('You must supply a scene description!');
    return;
  }

  if (this.players_ == []) {
    alert('You must supply add at least one player!');
    return;
  }

  var goInbox = function() {window.location = 'inbox.html';}
  var showError = function() {alert("Something went wrong...")};
  this.getApi()
    .newGame(this.labelInput_.value, this.players_)
    .then(goInbox, showError);
};


pifuxelck.controller.NewGameController.prototype.toggleContact_ =
    function(contact, button) {
  var id = contact['id'] + '';
  if (this.players_.indexOf(id) != -1) {
    goog.dom.classlist.add(button, 'unchecked');
    this.players_ = this.players_.filter(function(x) {return x != id});
  } else {
    goog.dom.classlist.remove(button, 'unchecked');
    this.players_ = this.players_.concat(id);
  }
};


pifuxelck.controller.NewGameController.prototype.loadContacts_ = function() {
  var addContactToList = goog.bind(function(contact) {
    var fragment = /** @type {Element} */ (soy.renderAsFragment(
        pifuxelck.ui.soy.newgame.contactInList,
        contact));

    var button = goog.dom.getElementByClass('button', fragment);
    button.addEventListener(
        'click',
        goog.bind(function() { this.toggleContact_(contact, button); }, this));

    this.contactsList_.appendChild(fragment);
  }, this);

  this.getDataStore().withContacts(goog.bind(function(db) {
    db.getAll().then(goog.bind(function(contacts) {
      goog.dom.removeChildren(this.contactsList_);

      for (var i = 0; i < contacts.length; ++i) {
        addContactToList(contacts[i]);
      }
    }, this));
  }, this));
};
