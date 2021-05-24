var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const StreamChat = require('stream-chat').StreamChat;

require('dotenv').config();

const server_side_client = new StreamChat(
  // process.env.APP_KEY,
  '12345',
  // process.env.APP_SECRET
  '12345'
);

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

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(cors());

app.post('/auth', async (req, res) => {
  console.log('🚀 ~ file: app.js ~ line 41 ~ app.post ~ user_id');
  const user_id = req.body.user_id;
  console.log('user ID: ', user_id);
  if (!user_id) {
    return res.status(400);
  }

  return res.send({
    token: server_side_client.createToken(user_id),
  });
});

app.get('/create-channel', async (req, res) => {
  const user_id = req.query.user_id;
  console.log('🚀 ~ file: app.js ~ line 53 ~ app.get ~ user_id', user_id);
  const sample_channel = server_side_client.channel(
    'messaging',
    'sample-room1',
    {
      name: 'Sample Room 1',
      image: 'http://bit.ly/2O35mws',
      created_by_id: user_id,
    }
  );

  // const create_channel = await sample_channel.create();
  // console.log('channel: ', create_channel);
  console.log('channel: ', sample_channel);

  res.send('ok');
});

app.post('/add-member', async (req, res) => {
  const user_id = req.body.user_id;
  const sample_channel = server_side_client.channel(
    'messaging',
    'sample-room1'
  );
  console.log(
    '🚀 ~ file: app.js ~ line 75 ~ app.post ~ sample_channel',
    sample_channel
  );
  const add_member = await sample_channel.addMembers([user_id]);
  console.log(
    '🚀 ~ file: app.js ~ line 83 ~ app.post ~ add_member',
    add_member
  );
  console.log('members: ', add_member);
  res.send('ok');
});

app.get('/send-message', async (req, res) => {
  const user_id = req.query.user_id;
  console.log('🚀 ~ file: app.js ~ line 53 ~ app.get ~ user_id', user_id);
  const sample_channel = server_side_client.channel(
    'messaging',
    'sample-room1',
    {
      created_by_id: user_id,
    }
  );

  const create_message = await sample_channel.create();
  console.log('create message: ', create_message);

  const text = 'Hello world!';
  const message = {
    text,
    user_id,
  };
  const send_message = await sample_channel.sendMessage(message);
  console.log('send message: ', send_message);

  res.send('ok');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
