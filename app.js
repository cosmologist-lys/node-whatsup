const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session =  require('express-session');

const index = require('./routes/index');
const home = require('./routes/home');
const blog = require('./routes/blog');
const blueprint = require('./routes/blueprint');
const weather = require('./routes/weather');
const todo = require('./routes/todo');
const music = require('./routes/music');

const app = express();
const ejs = require('ejs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/wtimgs',express.static(path.join(__dirname, 'public/weatherPNG')));
app.use('/bgimg',express.static(path.join(__dirname, 'public/images')));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'kepler',
    //name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 60*1000*60*24 },  //设置maxAge是1天，即1天后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/home', home);
app.use('/blog',blog);
app.use('/blue',blueprint);
app.use('/wea',weather);
app.use('/todo',todo);
app.use('/music',music);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
