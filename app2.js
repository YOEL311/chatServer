var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const socket = require('socket.io');

const cors = require('cors');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

const server = app.listen(process.env.PORT, function () {
  console.log(`Listening on port ${process.env.PORT}`);
  console.log(`http://localhost:${process.env.PORT}`);
});

// Socket setup
const io = socket(server);

const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log('Made socket connection');

  socket.on('new user', function (data) {
    console.log('🚀 ~ file: app2.js ~ line 44 ~ data', data);
    socket.userId = data;
    activeUsers.add(data);
    io.emit('new user', [...activeUsers]);
  });

  socket.on('chat message', function (data) {
    console.log('🚀 ~ file: app2.js ~ line 51 ~ data', data);
    data.time = Date.now();
    io.emit('chat message', data);
  });

  socket.on('end', function () {
    socket.disconnect();
    console.log('it will disconnet connection');
  });
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data);
  });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
