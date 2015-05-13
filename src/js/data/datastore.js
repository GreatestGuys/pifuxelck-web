goog.provide('pifuxelck.data.DataStore');

goog.require('goog.db.IndexedDb');
goog.require('goog.db.ObjectStore');
goog.require('pifuxelck.api.AuthTokenStorage');



/**
 * A persistent key-value store.
 * @constructor
 */
pifuxelck.data.DataStore = function() {

  /** @private {pifuxelck.api.AuthTokenStorage} */
  this.authStore_ = new pifuxelck.api.AuthTokenStorage();

  var dbName = this.getDbName_();
  console.log('orig db name: ' + dbName);

  /** @private {goog.Promise.<goog.db.IndexedDb>} */
  this.db_ = new goog.Promise(function(resolve, reject) {
    var dbRequest = window.indexedDB.open(
      dbName,
      pifuxelck.data.DataStore.DB_VERSION_);

    // these two event handlers act on the IDBDatabase object, when the database is opened successfully, or not
    dbRequest.onerror = function(event) {
      console.log('error occurred...');
      reject(event);
    };

    dbRequest.onsuccess = function(event) {
      console.log('success yo...');
      resolve(dbRequest.result);
    };

    dbRequest.onupgradeneeded = function(event) {
      console.log('upgrading shit...');
      var db = event.target.result;

      if (event.oldVersion < 1) {
        db.createObjectStore(
            pifuxelck.data.DataStore.HISTORY_STORE_,
            {keyPath: 'id'});
      }

      if (event.oldVersion < 2) {
        db.createObjectStore(
            pifuxelck.data.DataStore.CONTACTS_STORE_,
            {keyPath: 'id'});
      }
    };
  }, this);
};


/** @const @private {string} */
pifuxelck.data.DataStore.DB_NAME_PREFIX_ = 'pifuxelck-data-store-';


/** @const @private {number} */
pifuxelck.data.DataStore.DB_VERSION_ = 2;


/** @const @private {string} */
pifuxelck.data.DataStore.HISTORY_STORE_ = 'history';


/** @const @private {string} */
pifuxelck.data.DataStore.CONTACTS_STORE_ = 'contacts';


/**
 * Obtain the object store that contains the user's history.
 * @return {string}
 */
pifuxelck.data.DataStore.prototype.getDbName_ = function() {
  return pifuxelck.data.DataStore.DB_NAME_PREFIX_ + this.authStore_.getId();
};


/**
 * Obtain the object store that contains the user's history.
 * @param {!function(!goog.Promise.<!goog.db.ObjectStore>)} f
 */
pifuxelck.data.DataStore.prototype.withHistory = function(f) {
  return this.getObjectStore_(pifuxelck.data.DataStore.HISTORY_STORE_).then(f);
};


/**
 * Obtain the object store that contains the user's contacts list.
 * @param {!function(!goog.Promise.<!goog.db.ObjectStore>)} f
 */
pifuxelck.data.DataStore.prototype.withContacts = function(f) {
  return this.getObjectStore_(pifuxelck.data.DataStore.CONTACTS_STORE_).then(f);
};


/**
 * Retrieve the authentication token.
 * @return {!goog.Promise.<!goog.db.ObjectStore>}
 * @private
 * @template T
 */
pifuxelck.data.DataStore.prototype.getObjectStore_ = function(table) {
  return new goog.Promise(function(resolve, reject) {
    this.db_.then(function(db) {
      var objectStore = db.transaction([table], "readwrite").objectStore(table);
      resolve(new goog.db.ObjectStore(objectStore));
    }, reject, this);
  }, this);
};
