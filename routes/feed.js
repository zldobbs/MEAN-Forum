// handle requests to the feed 
// let's consciouslly try to use more arrow functions ;)
const express = require('express');
const router = express.Router();
const config = require('../config/db');
const Feed = require('../model/feed');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/getFeed', (req, res, next) => {
    Feed.getFeed((err, feed) => {
        if (err) {
            res.json({succ: false, msg: "failed to get feed"});
        }
        else {
            res.json({succ: true, feed: feed});
        }
    });
});

router.post('/addThreadToFeed', passport.authenticate('jwt', { session : false }), (req, res, next) => {
    Feed.addThread(req.body.feedThread, (err, feed) => {
        if (err) {
            res.json({succ: false, msg: "failed to add thread to feed"});
        }
        else {
            res.json({succ: true, feed: feed});
        }
    });
});

module.exports = router;
