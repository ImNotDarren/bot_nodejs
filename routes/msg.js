var express = require('express');
var router = express.Router();

var channel, connection;  //global variables

async function sendData(data) {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
  
    // close the channel and connection
    await channel.close();
    await connection.close();
  }


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
  
  module.exports = router