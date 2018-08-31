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
  originText : {
    type: String,
    required: true
  },
  posts : [{
    post_id : mongoose.Schema.Types.ObjectId
  }],
  threadTags : [{
    type: String,
    required: false
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

module.exports.getAllThreads = function(callback) {
  // second parameter of find() is the query
  Thread.find({ }, callback);
}

module.exports.getThreadsWithTag = function(selectedTags, callback) {
  console.log("filtering tags: " + selectedTags);
  Thread.find({"threadTags": {$in: selectedTags}}, callback);
}

module.exports.getThreadsWithId = function(thread_ids, callback) {
  console.log("finding threads for: " + thread_ids);
  // FIXME: not finding the threads...
  Thread.find({"_id": {$in: thread_ids}}, callback);
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
        {$push: {"posts": {_id : post_id}}},
        {safe: true, upsert: true, new : true},
      function(err, thread) {
        if (err) throw err;
        return thread;
      });
    }
  });
}

// delete thread
