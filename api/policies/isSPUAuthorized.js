/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  // TODO: Do this dynamically (hopefully with REDIS)
  if (req.headers && req.headers.authorization) {
    var token = req.headers.authorization;

    if (sails.config.globals.authorizedSPUTokens.indexOf(token) >= 0) {
      next();
    }
    else {
      return res.forbidden('Invalid SPU token');
    }
  }
  else {
    return res.forbidden('No SPU token provided');
  }
};
