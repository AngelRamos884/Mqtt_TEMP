//Importacion de librerias
var express  = require('express');
var app = express();
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.1.132');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var PORT = 3001;
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(PORT, function(){
  console.log('listening on : ' + PORT);
});
//Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const uri = 'mongodb://localhost/TestLab_Temp';

mongoose.connect(uri), function (err) {
 
  if (err) throw err;

  console.log('Successfully connected');

};

var temperaturaSchema = mongoose.Schema({

  temp:String,
  date:{
    type: Date,
    default: Date.now
   }

});

var TempSchema = mongoose.model('tempSchema', temperaturaSchema);



client.on("connect",function(){	
  console.log("connected  "+client.connected);
  })
//handle errors
client.on("error",function(error){
  console.log("Can't connect" + error);
  process.exit(1)});

  client.subscribe("casa/despacho/temperatura");

  client.on('message',function(topic, message, packet){
    console.log("message is "+ message);

    var Temp = new TempSchema({
      temp : message
    });

    Temp.save(function(err){

      console.log("Your data has been saved!");

      if (err) throw err;
      

    });

    let parsedMessage = JSON.parse(message);

    io.emit('temp', parsedMessage);


  });

  io.on('connection', (client) => {
    console.log("Socket connected.")
})

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

  //API
  app.get('/temp', (req, res)=>{

    // TempSchema.find({},(err, message)=>{

    //   res.send(message);

    // });

    TempSchema.find({}).sort({_id:-1}).limit(1).exec(function(err,docs) {

      res.send(docs);

    });


  });

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/getAllTemps', (req, res)=>{

    TempSchema.find({}).sort({_id:-1}).limit(70).exec(function(err,docs) {
      
      docs.map(function(x){
        
      });

      res.send(docs);

    });


  });