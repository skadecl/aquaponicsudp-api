/**
 * User.js
 */

var bcrypt = require('bcrypt');

module.exports = {
  tableName: 'users',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    role: {
      model: 'role',
      required: true
    },

    //References
    alarms: {
      collection: 'alarm',
      via: 'users',
      through: 'subscription'
    }
  },
  beforeCreate : function (values, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);
      bcrypt.hash(values.password, salt, function (err, hash) {
        if(err) return next(err);
        values.password = hash;
        next();
      })
    })
  },
  comparePassword : function (enteredPassword, userPassword, cb) {
    bcrypt.compare(enteredPassword, userPassword, function (err, match) {
      if(err) cb(err);
      else cb(null, match);
    })
  }
};
