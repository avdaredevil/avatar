var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app)
GLOBAL.io = require('socket.io')(server)
//==DB=========================================================================|
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//==Routes=====================================================================|
app.use('/module', express.static(path.join(__dirname, 'bower_components')));
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/app'));
//==Sockets====================================================================|
var Users = {Dashboard: 0}
var Dashboard = GLOBAL.io.on('connection', function(socket){
    var User = ++Users.Dashboard
    socket.broadcast.emit("User Count", {count: Users.Dashboard, incr: true})
    
    socket.on("camera:stream", function(data) {console.log(data);socket.emit("Camera:Receive", {message: data})})
    socket.on("test", function(data) {console.log(data);socket.emit("receive", {message: "Success bruh!"})})
    socket.on("users:get", function(data) {socket.emit("User Count", {count: Users.Dashboard})})
    socket.on("error", function(err) {console.log("Socket Err for User-"+User,err)})
    socket.on("disconnect", function() {socket.broadcast.emit("User Count", {count: --Users.Dashboard, incr: false}); console.log(Users.Dashboard)})
})
//==Handlers===================================================================|
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var debug = require('debug')('JMeter-Listener:server');
server.listen(normalizePort(process.env.PORT || '3000'))
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {var port = parseInt(val, 10);if (isNaN(port)){return val};if (port>=0) {return port};return false}
function onError(e){if("listen"!==e.syscall)throw e;var r="string"==typeof port?"Pipe "+port:"Port "+port;switch(e.code){case"EACCES":console.error(r+" requires elevated privileges"),process.exit(1);break;case"EADDRINUSE":console.error(r+" is already in use"),process.exit(1);break;default:throw e}}
function onListening(){var e=server.address(),r="string"==typeof e?"pipe "+e:"port "+e.port;debug("Listening on "+r)}
