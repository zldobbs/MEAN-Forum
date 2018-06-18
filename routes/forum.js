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

  // NOTE: use null value for thread initially, update after thread is created
  // TODO: check if this could lead to security vulnerabilities
  const newPost = new Post({
    thread_id : null, // for now
    username  : req.body.username,
    body      : req.body.bodyText,
    timestamp : new Date(), // current time
    replies   : [] // no replies to start
  });

  Post.addPost(newPost, function(err, post) {
    if (err) {
      res.json({succ: false, msg : "failed to create new thread"});
    }
    else {
      // create the new thread
      // FIXME: let or const here?
      var newThread = new Thread({
        creator   : req.body.username, // this should be == to post.username
        posts     : [], // for now
        timestamp : new Date()
      });
      // add the newly created post to the thread
      newThread.posts.push(post._id);

      Thread.addThread(newThread, function(err, thread) {
        if (err) {
          res.json({succ: false, msg: "failed to create new thread"});
        }
        else {
          // update the post thread id
          Post.updateThreadId(post._id, thread._id, function(err, updatedPost) {
            if (err) {
              res.json({succ: false, msg: "failed to create new thread"});
            }
          });
          // done
          res.json({succ: true, msg: thread});
        }
      });
    }
  });

});

// get all threads currently in the database
router.get('/allThreads', function(req, res, next) {
  // return thread json object
  Thread.getAllThreads(function(err, threads) {
    if (err) {
      res.json({succ: false, msg: 'failed to get all threads'});
    }
    else {
      res.json(threads);
    }
  });
});

// get the thread information
router.get('/viewThread', function(req, res, next) {
  // return thread json object
});

// adding posts to threads
router.post('/createPost', passport.authenticate('jwt', { session : false }), function(req, res, next) {
  // need to send thread id with this function
  // check if the post is a reply

  const newPost = new Post({
    thread_id : req.body.thread_id,
    username  : req.body.username,
    body      : req.body.bodyText,
    timestamp : new Date(), // current time
    replies   : [] // no replies to start
  });

  // validate thread exists
  Thread.getThread(thread_id, function(err, thread) {
    if (err) {
      res.json({succ: false, msg: "failed to insert post"});
    }
    else {
      // insert post to db
      newPost.addPost(function(err, post) {
        if (err) {
          res.json({succ: false, msg: "failed to insert post"});
        }
        else {
          // add post id to the thread's array
          // should thread be a const? it's the return value from above
          thread.addPost(post._id, function(err, post) {
            if (err) {
              res.json({succ: false, msg: "failed to insert post"});
            }
          });
          // done
          res.json({succ: true, msg: post});
        }
      });
    }
  });

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
