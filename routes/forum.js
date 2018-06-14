// routes handle creation and management of threads 

const express = require('express');
const router = express.Router();
const config = require('../config/db');
// const User = require('../model/post'); 
const passport = require('passport');
const jwt = require('jsonwebtoken');

// creating new threads 
router.post('/createThread', function(req, res, next) {
    // add new thread to mongo, set owner 
});

// get the thread information
router.get('/viewThread', function(req, res, next) {
    // return thread json object 
});

// adding posts to threads 
router.post('/addPost', function(req, res, next) {
    // need to send thread id with this function 
    // check if the post is a reply 
});

// deletes a user's thread
router.post('/deleteThread', function(req, res, next) {
    // FIXME: implement later 
});

// deletes a user's post 
router.post('/deletePost', function(req, res, next) {
    // FIXME: implement later 
});

