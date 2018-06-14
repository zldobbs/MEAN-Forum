const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');
const Post = require('./post');

// threads are collections of posts 
const ThreadSchema = mongoose.Schema({
  creator : {
    type: String, 
    required: true
  },
  posts : [{
    post_id : mongoose.Schema.Types.ObjectId
  }],
  timestamp : {
    type: Date,
    required: true
  }
});

const Thread = module.exports = mongoose.model('Thread', ThreadSchema);

module.exports.getThread = function(id, callback) {
  Thread.findById(id, callback);
}

module.exports.addThread = function(newThread, callback) {
  // NOTE: when creating threads, will need to ensure an initial post
  // i.e. no thread should ever have an empty posts []
  newThread.save(callback);
}

module.exports.addPost = function(post_id, callback) {
  Post.getPost(post_id, function(err, post) {
    if (err) throw err;
    else {
      Thread.findByIdAndUpdate(
        post.thread_id,
        {$push: {"posts": {post_id : post_id}}},
        {safe: true, upsert: true, new : true},
      function(err, thread) {
        if (err) throw err;
        return thread;
      });
    }
  });
}

// delete thread