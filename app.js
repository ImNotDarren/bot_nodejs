var createError = require('http-errors');
var express = require('express');
const amqp = require("amqplib");
const msg = require('./routes/msg')

var app = express();

app.get('/', (req, res) => {
  res.send("main page")
})

app.get('/send-msg', msg)

async function connectQueue() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel()

    await channel.assertQueue("test-queue")

  } catch (error) {
    console.log(error)
  }
}

connectQueue()

app.listen(8081)

module.exports = app

