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
  thread_id : {
    type : mongoose.Schema.Types.ObjectId 
    // require : true //> not required for now, 
    // --> if this is null initially then this should be treated as the initial post for a new thread
  },
  username : {
    type: String,
    require: true
  },
  body : {
    type: String,
    require: true
  },
  timestamp : {
    type: Date,
    required: true
  },
  replies : [{
    // foreign key 
    post_id : mongoose.Schema.Types.ObjectId
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
  function(err, post) {
    if (err) throw err;
    return post;
  });
}

// delete post 