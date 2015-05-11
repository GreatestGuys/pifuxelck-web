goog.provide('pifuxelck.controller.ContactsController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('pifuxelck.api');
goog.require('pifuxelck.controller.BaseController');
goog.require('pifuxelck.data.User');
goog.require('pifuxelck.ui.soy.contacts');



/**
 * @constructor
 */
pifuxelck.controller.ContactsController = function() {
  pifuxelck.controller.BaseController.call(this);

  /** @private {Element} */
  this.userInput_ = document.getElementById('username-lookup');

  /** @private {Element} */
  this.contactsList_ = document.getElementById('contacts-list');

  /** @private {Element} */
  this.addContactButton_ = document.getElementById('add-contact');
  this.addContactButton_.onclick = goog.bind(this.addContact_, this);

  /** @private {?pifuxelck.data.User} */
  this.currentContact_ = null;

  this.userInput_.addEventListener(
      'keyup',
      goog.bind(this.onLookupChange_, this));

  this.loadContacts_();
};
goog.inherits(
    pifuxelck.controller.ContactsController,
    pifuxelck.controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.ContactsController',
    pifuxelck.controller.ContactsController);


pifuxelck.controller.ContactsController.prototype.onLookupChange_ = function() {
  var displayName = this.userInput_.value;

  var onFailure = goog.bind(function() {
    this.currentContact_ = null;
    goog.dom.classes.add(this.addContactButton_, 'hidden');
  }, this);

  var onSuccess = goog.bind(function(id) {
    if (this.userInput_.value != displayName ||
        // Do not add yourself as a contact.
        id == this.getAuthStore().getId()) {
      onFailure();
      return;
    }

    goog.dom.classes.remove(this.addContactButton_, 'hidden');
    this.currentContact_ = {'id': id, 'display_name': displayName};
  }, this);

  this.getApi()
    .lookupUserId(displayName)
    .then(onSuccess, onFailure);
};


pifuxelck.controller.ContactsController.prototype.loadContacts_ = function() {
  var addContactToList = goog.bind(function(contact) {
    var fragment = soy.renderAsFragment(
        pifuxelck.ui.soy.contacts.contactInList,
        contact);

    var removeButton = goog.dom.getElementByClass('button', fragment);
    removeButton.addEventListener(
        'click',
        goog.bind(function() { this.removeContact_(contact); }, this));

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


pifuxelck.controller.ContactsController.prototype.addContact_ = function() {
  this.getDataStore().withContacts(goog.bind(function(db) {
    if (!this.currentContact_) {
      return;
    }

    db.add(this.currentContact_)
      .then(goog.bind(this.loadContacts_, this));
  }, this));
};


pifuxelck.controller.ContactsController.prototype.removeContact_ =
    function(contact) {
  this.getDataStore().withContacts(goog.bind(function(db) {
    db.remove(contact['id'])
      .then(goog.bind(this.loadContacts_, this));
  }, this));
};
