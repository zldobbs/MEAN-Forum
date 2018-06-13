/*
  MEAN Forum 
  Zachary Dobbs -- 2018
*/

// initialize app
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
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
app.use(bodyParser.json());

// passport init for authentication
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// route and static pathing
const users = require('./routes/users');

app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/users', users);

// FIXME: add error-handling for bad URL requests

// serve the app
http.listen(3000, function() {
  console.log("Listening on *:3000");
});
