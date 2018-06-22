const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

// A post is a user's message posted on a thread
const PostSchema = mongoose.Schema({
  /*
    FIXME: may come back to add the following features:
    title : String,
    media : array[Images],

    TODO: look into the ability to embed YouTube video
  */
  thread_id : mongoose.Schema.Types.ObjectId,
  username : {
    type: String,
    required: true
  },
  body : {
    type: String,
    required: true
  },
  timestamp : {
    type: Date,
    required: true
  },
  replies : [{
    _id : mongoose.Schema.Types.ObjectId,
    username : String,
    bodyText : String,
    timestamp : Date
  }]
});

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.getPost = function(id, callback) {
  Post.findById(id, callback);
}

module.exports.addPost = function(newPost, callback) {
  // should authentication of the user occur here? probably not but debug to be sure
  newPost.save(callback);
}

module.exports.updateThreadId = function(post, newThreadId, callback) {
  Post.findByIdAndUpdate(
    post._id,
    {thread_id : newThreadId},
    {safe: true, upsert: true, new : true},
  function(err, updatedPost) {
    if (err) throw err;
    return updatedPost;
  });
}

module.exports.addReply = function(reply_id, post, callback) {
  console.log('reply is = ' + post);
  Post.findByIdAndUpdate(
    reply_id,
    {$push: {"replies": {
      _id: post._id,
      username: post.username,
      bodyText: post.body,
      timestamp: post.timestamp
    }}},
    {safe: true, upsert: true, new : true},
  function(err, updatedPost) {
    if (err) throw err;
    return updatedPost;
  });
}

// delete post
