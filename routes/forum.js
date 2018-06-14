// routes handle creation and management of threads 

const express = require('express');
const router = express.Router();
const config = require('../config/db');
const Post = require('../model/post');
const Thread = require('../model/thread'); 
const passport = require('passport');
const jwt = require('jsonwebtoken');

// creating new threads 
router.post('/createThread', passport.authenticate('jwt', { session : false }), function(req, res, next) {
    // add new thread to mongo, set owner, send initial post 

    // NOTE: won't check if thread exists if the post is the origin post of the thread?
    // --> more fields in req.body? probably so 
    // -----> NO! check what value is sent for thread_id, if null then make a new thread 
    // -----> is this actually safe? create a special value for creating a new thread? 
    const newPost = new Post({
      thread_id : null, // for now 
      username  : req.body.username,
      body      : req.body.bodyText,
      timestamp : new Date(), // current time 
      replies   : [] // no replies to start 
    });

    // add the post before the thread, need post info to create
    const newThread = new Thread({
      creator   : null, // for now 
      posts     : null, // for now 
      timestamp : new Date() 
    });

});

// get the thread information
router.get('/viewThread', function(req, res, next) {
    // return thread json object 
});

// adding posts to threads 
router.post('/addPost', passport.authenticate('jwt', { session : false }), function(req, res, next) {
    // need to send thread id with this function 
    // check if the post is a reply 

    const newPost = new Post({
      thread_id : req.body.thread_id,
      username  : req.body.username,
      body      : req.body.bodyText,
      timestamp : new Date(), // current time 
      replies   : [] // no replies to start 
    });

    var data = {};

    // validate thread exists 
    Thread.getThread(thread_id, function(err, thread) {
      if (err) {
        data = {succ: false, msg: "failed to insert post: " + err};
      }
      else {
        // insert post to db
        newPost.addPost(function(err, post) {
          if (err) {
            data = {succ: false, msg: "failed to insert post: " + err};
          }
          else {
            // add post id to the thread's array 
            // should thread be a const? it's the return value from above
            thread.addPost(post._id, function(err, post) {
              if (err) {
                data = {succ: false, msg: "failed to insert post: " + err};
              }
              else {
                data = {succ: true, msg: "created post in thread"};
              }
            });
          }
        });
      }
    });
    // TODO: check if data is empty
    res.json(data);
    // TODO: check if the post is a reply
    // --> send 2 more fields in req.body, bool isReply and user_id 
    // ----> getPost on the user_id, if it doesn't exist something has gone terribly wrong in the logic 
});

// deletes a user's thread
router.post('/deleteThread', passport.authenticate('jwt', { session : false }), function(req, res, next) {
    // FIXME: implement later 
    // Thread.findByIdAndDelete
});

// deletes a user's post 
router.post('/deletePost', passport.authenticate('jwt', { session : false }), function(req, res, next) {
    // FIXME: implement later 
    // Post.findByIdandDelete
});

module.exports = router;