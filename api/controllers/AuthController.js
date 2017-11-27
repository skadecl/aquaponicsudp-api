/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  signIn: function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }

    User.findOne({email: email}, function (err, user) {

      if (!user) {
        return res.forbidden();
      }
      else if (err) {
        return res.serverError();
      }
      else {
        User.comparePassword(password, user.password, function (err, valid) {
          if (err) return res.serverError();
          else if (!valid) {
            return res.forbidden();
          }
          else {
            delete user.password;
            delete user.createdAt;
            delete user.updatedAt;
            return res.status(200).json({user: user, token: jwtHandlerService.issue({id : user.id })})
          }
        })
      }
    })
  },

  signUp: function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      return res.json(401, {err: 'Las contraseñas no coinciden.'});
    }
    User.create(req.body).exec(function (err, user) {
      if (err) {
        return res.json(err.status, {err: err});
      }
      // If user created successfuly we return user and token as response
      if (user) {
        // NOTE: payload is { id: user.id}
        delete user.password;
        res.json(200, {user: user, token: jwtHandlerService.issue({id: user.id})});
      }
    });
  }
};
