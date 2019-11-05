'use strict'
const express = require('express');
const app = express();
const { EtherPortClient } = require('etherport-client');
const five = require('johnny-five');
const CONFIG = {
    PORT:3000
}
  const board = new five.Board({
    port: new EtherPortClient({
      host: '192.168.1.60',
      port: 3030
    }),
    repl: false
  });

board.on("ready", () => {
    
   var pulseS = new five.Pin({
       pin:5
  });

//   temp.on("change", function(){

//       console.log("celsius: %d", (this.C ));
      
//   })
pulseS.read((err, val) =>{
    
    // var tem1 = (val * 5000) / 1024;
    // tem1 = tem1 - 500;
    // var cel = tem1 / 10;
    // console.log(cel);
    console.log(val);
    
    
})
 
});

app.listen(CONFIG.PORT,()=>{

    console.log("Server on: ", CONFIG.PORT);

   

});

app.get('/',(req, res)=>{
    res
})