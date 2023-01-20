var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const amqp = require("amqplib");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var channel, connection;  //global variables

var app = express();
const router=express.Router()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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


async function connectQueue() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel()

    await channel.assertQueue("test-queue")

  } catch (error) {
    console.log(error)
  }
}

async function sendData(data) {
  // send data to queue
  await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));

  // close the channel and connection
  await channel.close();
  await connection.close();
}

connectQueue()

router.get("/send-msg", (req, res) => {

  // data to be sent
  const data = {
    title: "Six of Crows",
    author: "Leigh Burdugo"
  }
  sendData(data);  // pass the data to the function we defined
  console.log("A message is sent to queue")
  res.send("Message Sent"); //response to the API request

})



module.exports = app;
