// routes handle authentication and profile management 

const express = require('express');
const router = express.Router();
const config = require('../config/db');
const User = require('../model/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// registration
router.post('/register', function(req, res, next) {
  let newUser = new User({
    name : req.body.name,
    email : req.body.email,
    username : req.body.username,
    password : req.body.password,
    profilePicture : req.body.profilePicture
  });

  User.addUser(newUser, function(err, user) {
    if (err) {
      res.json({
        succ : false,
        msg  : "user registration failed"
      });
    }
    else {
      res.json({
        succ : true,
        user : user
      });
    }
  });
});

// registration
router.post('/authenticate', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, function(err, user) {
    if (err) throw err;
    if (!user)
      return res.json({
        succ : false,
        msg  : "user not found"
      });
    User.comparePassword(password, user.password, function(err, isMatch) {
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // FIXME this is currently 1 week, better time?
        });

        res.json({
          succ  : true,
          token : 'JWT ' + token,
          user  : {
            id       : user._id,
            name     : user.name,
            email    : user.email,
            username : user.username
          }
        });
      }
      else {
        res.json({
          succ : false,
          msg  : "incorrect password"
        });
      }
    });
  });
});

// registration
router.get('/profile', passport.authenticate('jwt', { session : false }), function(req, res, next) {
  res.json({ user : req.user });
});

module.exports = router;
