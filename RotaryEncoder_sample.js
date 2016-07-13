//Setup express 
var express = require('express');
var app = express();
app.use(express.static(__dirname));
var server = app.listen(8085);
var io = require('socket.io').listen(server);



var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

//var myOnboardLed = new mraa.Gpio(3, false, true); //LED hooked up to digital pin (or built in pin on Galileo Gen1)
var myOnboardLed = new mraa.Gpio(13); //LED hooked up to digital pin 13 (or built in pin on Intel Galileo Gen2 as well as Intel Edison)
myOnboardLed.dir(mraa.DIR_OUT); //set the gpio direction to output

//Require the encoder and button libraries. 
var rotaryEncoder = require("jsupm_rotaryencoder");
var groveSensor = require('jsupm_grove'); 
// Instantiate a Grove Rotary Encoder, using signal pins D2 and D3
var myRotaryEncoder = new rotaryEncoder.RotaryEncoder(2, 3);
//Set up a button on D4
var button = new groveSensor.GroveButton(4); 
 
//We will send data to our client with this object. 
var data = {}; 

//When we get a socket connection we will monitor the switch. 
io.sockets.on('connection', function (socket) {
 
 //Every 100 milli seconds we will send an update to the client. 
 //You won't want to monitor encoder this way for a real project
 //but it will demonstrate the encoder and switch. 
 setInterval(function () {
 //See what the switch value is.
 readButtonValue(); 
 //Sample the current position of the encoder. 
 //Since this is an incremental encoder we will
 //get increasing or decreasing int values from 
 //the encoder library. 
 data.position = myRotaryEncoder.position();
 //For the porposes of this demo, if we go lower than -40
 //or higher than 40 we will reset the encoder init to 0. 
 if(Math.abs(data.position) > 40 ) {
 myRotaryEncoder.initPosition(0);
 data.position = 0; 
 }
 //Send the position in a json encoded string. 
 socket.emit( 'position' , JSON.stringify(data));
 }, 100);

 //Toggle the on board led on or off. 
 socket.on('toggle_led', function(data){
 if(data === 'on'){
 myOnboardLed.write(0);
 } else {
 myOnboardLed.write(1); 
 }
 });
 

});

//A fuction to read our button value
function readButtonValue() {
 //If our button is pressed set the 
 //encoder init to 0. 
 if(button.value() === 1 ) {
 myRotaryEncoder.initPosition(0); 
 } 
}
 


// When exiting: clear interval and print message

process.on('SIGINT', function()

{

 clearInterval(myInterval);

 console.log("Exiting...");

 process.exit(0); 
 
});
