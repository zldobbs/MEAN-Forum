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
        originText: req.body.bodyText,
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
          res.json({succ: true, thread: thread});
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
      res.json({succ: true, threads: threads});
    }
  });
});

// get all posts in the thread with id : thread_id
router.post('/postsFromThread', function(req, res, next) {
  const thread_id = req.body.thread_id;
  console.log('thread sent = ' + thread_id);
  console.log('req = ' + req);
  // get this thread
  Thread.getThread(thread_id, function(err, thread) {
    if (err) {
      res.json({succ: false, msg: 'failed to get the posts from the thread'});
    }
    else {
      console.log(thread);
      var posts = [];
      var postsCount = 0;
      const threadPostsLength = thread.posts.length;
      thread.posts.forEach(function(post_id, index) {
        Post.getPost(post_id, function(err, post) {
          console.log(index);
          if (err) {
            res.json({succ: false, msg: 'failed to get the posts from the thread'});
          }
          else {
            console.log(post);
            posts.push(post);
            postsCount++;
            if (postsCount == threadPostsLength) {
              res.json({succ: true, posts: posts});
            }
          }
        });
        console.log('posts are: ' + posts);
      });
    } 
  });
});

// adding posts to threads
router.post('/createPost', passport.authenticate('jwt', { session : false }), function(req, res, next) {
  // need to send thread id with this function
  // check if the post is a reply

  const newPost = new Post({
    thread_id : req.body.thread_id,
    // NOTE: look into using user id here instead of username
    username  : req.body.username,
    body      : req.body.bodyText,
    timestamp : new Date(), // current time
    replies   : [] // no replies to start
  });

  // validate thread exists
  Thread.getThread(newPost.thread_id, function(err, thread) {
    if (err) {
      res.json({succ: false, msg: "failed to insert post"});
    }
    else {
      // insert post to db
      Post.addPost(newPost, function(err, post) {
        if (err) {
          res.json({succ: false, msg: "failed to insert post"});
        }
        else {
          // add post id to the thread's array
          Thread.addPost(post._id, function(err, post) {
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
