//Configurate
const CONFIG = {

    PORT: 3000

};
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

server.listen(CONFIG.PORT, function(){

    console.log('server on port: ' + CONFIG.PORT);

});

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", () => {
  var sensor = new five.Sensor("A0");
  
  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  sensor.on("change", () => {
    
    var data = (sensor.scaleTo(513, 600));

    io.on('connection', function(client){
        client.emit('temp', data);
    })

  });
});