const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

// users are the controller's of the application
const UserSchema = mongoose.Schema({
  name : {
    type: String
    // not required, if not provided identify as Anonymous
    // -- anonymity should be valued here. people should feel comfortable
  },
  username : {
    type: String,
    require: true
  },
  email : {
    // forgot password, updates?
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  profilePicture : {
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  let query = {username: username};
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  // FIXME: before adding user, check if username or email already exists 
  // User.findOne({username: newUser.username}, (err, user) => {
  //   if (user) {
  //     throw "username already exists";
  //   }
  //   else {
  //     User.findOne({email: newUser.email}, (err, user) => {
  //       if (user) {
  //         throw "email already exists";
  //       }
  //     });
  //   }
  // });
  bcrypt.genSalt(10, function(err, salt) {
    if (err) throw err;
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(passwordAttempt, hash, callback) {
  bcrypt.compare(passwordAttempt, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.updateProfilePicture = function(email, filename, callback) {
  User.findOneAndUpdate(
    { email: email },
    { profilePicture : filename },
    callback
  );
}