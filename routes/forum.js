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
          res.json({succ: true, thread_id: thread._id});
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
  // get this thread
  Thread.getThread(thread_id, function(err, thread) {
    if (err) {
      res.json({succ: false, msg: 'failed to get the posts from the thread'});
    }
    else if (thread) {
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
        console.log('posts: ' + posts);
      });
    }
  });
});

// adding posts to threads
router.post('/createPost', passport.authenticate('jwt', { session : false }), function(req, res, next) {
  // need to send thread id with this function

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
});

// adding replies to posts
// NOTE: this is kinda funky implementation..
// does it leave any glaring dependency issues? the thread has no idea this post exists
// until it hits the reply...
// this could actually be ingenius
// deleting the reply will delete all replies. is this a good thing?
// consider `the good place`
router.post('/createReply', passport.authenticate('jwt', { session : false }), function(req, res, next) {
  // need to send thread id with this function
  // check if the post is a reply
  const reply_id = req.body.reply_id;
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
          console.log('post = ' + post);
          // add the post to the replies of the the parent post
          Post.addReply(reply_id, post, function(err, post) {
            // should return updated post
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
