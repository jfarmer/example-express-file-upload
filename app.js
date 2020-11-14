let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let dotenv = require('dotenv');

// dotenv allows us to set environment variables in development
// by editing the .env file. In production, we'd use "herok config".
dotenv.config();
let app = express();

app.root = (...args) => path.join(__dirname, ...args);

// Helper functions to check whether we're in the production
// or development environment.
app.inProduction = () => app.get('env') === 'production';
app.inDevelopment = () => app.get('env') === 'development';

// Tell Express to look in views/ to find our view templates
// and to use the Handlebars (hbs) to render them.
app.set('views', app.root('views'));
app.set('view engine', 'hbs');

if (app.inDevelopment()) {
  app.use(logger('dev'));
} else {
  app.use(logger('combined'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(app.root('public')));

let routes = require('./routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
