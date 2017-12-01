var express = require('express');
const express_paginate = require('express-paginate');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoImport = require('mongoImport');
var fileSystem = require('fs');
var os = require('os');
const pug = require('pug');
var paginate = require('express-paginate');
var methodOverride = require('method-override')

var index = require('./routes/index.js');
var users = require('./routes/userRouter.js');
var items = require('./routes/itemRouter.js');

var app = express();

var userOS = os.userInfo();

var currentUserName = userOS.username;
console.log('Your username', ':', currentUserName);

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://JuanDa95:yolo95@ds155091.mlab.com:55091/cv-it-checkout';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Method override was not here before
// override with POST having ?_method=PUT
app.use(methodOverride('_method'))
app.use(expressValidator()); //Express-validator uses the body parser to access parameters
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//Define particular routes for different parts of the site. 
//Add routes to middleware chain.

// Keep the paginate middleware before all routes that will use pagination
app.use(paginate.middleware(10, 10));
app.use('/', index);
//Paginate middleware was here before
app.use('/users', users);
app.use('/items', items);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Set a limit on the amount of queries displayed just in case people try to fetch all results at once 
app.all(function(req, res, next) {
    // set default or minimum is 10 (as it was prior to v0.2.0)
    if (req.query.limit <= 10) req.query.limit = 10;
    next();
});

module.exports = app;