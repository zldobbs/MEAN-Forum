/*
  MEAN Forum
  Zachary Dobbs -- 2018
  FIXME: at some point should remove the debug statements from production builds
  Win10 Script for mongo shell - "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"
  -- mongod should be running as dameon on Win10. if it isn't, run ^ w/ `...\bin\mongod.exe` 
*/

// initialize app
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const config = require('./config/db');

// establish mongodb connection
mongoose.connect(config.database);
mongoose.connection.on('connected', function() {
  console.log('connected to database ' + config.database);
});
mongoose.connection.on('error', function(error) {
  console.log('database connection error: ' + error);
});

const app = express();
const http = require('http').Server(app);

app.use(cors());
app.use(methodOverride('_method'));
app.use(bodyParser.json());

// passport init for authentication
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// route and static pathing
const users = require('./routes/users');
const forum = require('./routes/forum');
const upload = require('./routes/upload');
const feed = require('./routes/feed');

app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/users', users);
app.use('/forum', forum);
app.use('/upload', upload);
app.use('/feed', feed);

// FIXME: add error-handling for bad URL requests

// serve the app
http.listen(3000, function() {
  console.log("Listening on *:3000");
});
