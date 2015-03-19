goog.provide('pifuxelck.api');

goog.require('pifuxelck.api.Api');
goog.require('pifuxelck.api.ApiImpl');
goog.require('pifuxelck.api.AuthTokenStorage');


/**
 * Obtain a reference to the global API object.
 * @param {string=} opt_protocol the protocol to use
 * @param {string=} opt_host the host of the API server
 * @param {number=} opt_port the port the API server is running on
 * @return {pifuxelck.api.Api}
 */
pifuxelck.api.newApi = function(opt_protocol, opt_host, opt_port) {
  return new pifuxelck.api.ApiImpl(
      new pifuxelck.api.AuthTokenStorage(),
      opt_protocol,
      opt_host,
      opt_port);
};
