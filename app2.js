var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

const socket = require('socket.io');

const cors = require('cors');

require('dotenv').config();

var app = express();

// view engine setup
app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
const io = socket(server);

io.on('connection', (socket) => {
  console.log('Made socket connection');

  socket.on('chat message', function (data) {
    console.log('🚀 ~ file: app2.js ~ line 51 ~ data', data);
    data.time = Date.now();
    io.broadcast.emit('chat message', data);
    // io.emit('chat message', data);
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
