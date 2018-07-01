// handle file uploads
// mainly photo's at this point

const main = require('../main');
const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const config = require('../config/db');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// pull in connection from main
const connection = mongoose.connection;

// init grid stream
let gfs;

// NOTE: from now on, starting to use the new ES6 functions here
// this is pretty inconsistent with current code base, when I get bored or hire an intern we'll clean up
connection.once('open', () => {
  // initialize grid stream
  gfs = Grid(connection.db, mongoose.mongo);
  // need to look into what collection the files should be stored in
  gfs.collection('uploads'); // collection name should match bucket name !!!
});

const storage = new GridFsStorage({
  url: config.database,
  file: (req, file) => {
    console.log('attempting to upload file gfs...');
    console.log(file);
    // NOTE: also following ES6, going to start using Promises when applicable
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        else {
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads' // bucket name should match collection name !!!
          }
          resolve(fileInfo);
        }
      });
    });
  }
});

const upload = multer({ storage });

router.post('/', passport.authenticate('jwt', { session : false }), upload.single('file'), (req, res) => {
  res.json({succ: true, file: req.file}); 
});

router.get('/image/:filename', (req, res) => {
  console.log('fetching filename: ' + req.params.filename);
  gfs.files.findOne({ filename : req.params.filename }, (err, file) => {
    if (file) {
      // checking specifically for image here
      if (file.contentType == 'image/png' || file.contentType == 'image/jpeg') {
        res.set('Content-Type', file.mimetype);
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      }
      else {
        const err = { succ: false, msg: "file is not an image" };
        res.json(err);
      }
    }
    else {
      const err = { succ: false, msg: "failed to find file" };
      res.json(err);
    }
  });
});

router.post('/updateProfilePicture', passport.authenticate('jwt', { session : false }), (req, res) => {
  console.log('updating profile picture.. ' + req.body.email + ' ' + req.body.filename);
  User.updateProfilePicture(req.body.email, req.body.filename, (err, user) => {
    if (err) {
      res.json({succ: false, msg: err});
    }
    else {
      res.json({succ: true, msg: req.body.filename});
    }
  });
});

module.exports = router;
