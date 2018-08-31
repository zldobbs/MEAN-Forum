// Store feed specific threads
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

const FeedSchema = mongoose.Schema({
    thread_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    additional_text: {
        type: String,
        require: false
    },
    // timestamp for when the thread was added
    // seems necessary since thread could be added to feed long after original creation
    timestamp_added: {
        type: Date,
        require: true
    }
    // omitting reply functionality for the time being
});

const Feed = module.exports = mongoose.model('Feed', FeedSchema);

// the feed will be a collection of curated threads, or threads created by us
// how should the database handle this?
// 1. Array of threads
// 2. Add boolean to all threads
// 3. Store individual threads in this collection.. <-- this 
/*
    3. implementation:
        - get all thread ids from feed schema O(N)
        - pull all threads from thread schema based on each individual id O(N)
        - DON'T pull posts for threads until user selects to O(0)
        - overall: O(N)
*/

module.exports.getFeed = function(callback) {
    // get all threads in the feed, later on create function to get specific 
    Feed.find({ }, callback);
}

module.exports.addThread = function(newFeedThread, callback) {
    newFeedThread.save(callback);
}
