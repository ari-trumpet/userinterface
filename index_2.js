"use strict";

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var os = require("os");
var flock = require("flocking");

//setup/Initialization for upm
var upm_groveSensor = require('jsupm_grove');
var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());

/* Server */

app.use(express.static("static"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/static/keyboard.html");
});

var server = http.listen(3000, function () {
	/* get ip address */
	var interfaces = os.networkInterfaces();
	var wlan = interfaces["wlan0"];
	var addr, host, port;

	addr = server.address();
	port = addr.port;

	if (wlan && wlan.length > 0) {
		host = wlan[0].address;
	} else {
		host = addr.address;
	}

	console.log("Keyboard is at http://" + host + ":" + port + "/");
});

io.on("connection", function (socket) {
	console.log("user connected");
	socket.on("pressStart", pressStart);
	socket.on("pressEnd", pressEnd);
});

/* Button */
  // Create the button object using GPIO pin 0
var button0 = new upm_groveSensor.GroveButton(0);
var button1 = new upm_groveSensor.GroveButton(3);
var button2 = new upm_groveSensor.GroveButton(5);
var button3 = new upm_groveSensor.GroveButton(7);
//var button3 = new upm_groveSensor.GroveButton(3);
  // Read the input and print, waiting one second between readings

buttonloop();

function buttonloop(){
  console.log(button0.name() + "0 value is " + button0.value());
  console.log(button1.name() + "1 value is " + button1.value());
  console.log(button2.name() + "2 value is " + button2.value());
  console.log(button3.name() + "3 value is " + button3.value());

  setTimeout(buttonloop, 300);
}

/*    
var analogPin4 = new m.Dio(4);
var analogValue = analagPin4.read();
function readButtonValue4() {
    console.log('button sensor4 value is ' + analogValue);
}
*/
//var button3 = new groveSensor

/* Rotary */
  //setup access analog input Analog pin #0 (A0)

var groveRotary = new upm_groveSensor.GroveRotary(0);

loop();

function loop()
{
    var abs = groveRotary.abs_value();
    var absdeg = groveRotary.abs_deg();
    var absrad = groveRotary.abs_rad();

    var rel = groveRotary.rel_value();
    var reldeg = groveRotary.rel_deg();
    var relrad = groveRotary.rel_rad();       
    
    //write the knob value to the console in different formats

console.log("Volume: " + abs);
//console.log("Rel: " + rel + " " + Math.round(parseInt(reldeg)) + " " + relrad.toFixed(3));

    //wait 2 s and call function again

  setTimeout(loop, 300);
 }

/* RotaryEncoder */
var rotaryEncoder = require("jsupm_rotaryencoder");
  // Instantiate a Grove Rotary Encoder, using signal pins D2 and D3
var myRotaryEncoder0 = new rotaryEncoder.RotaryEncoder(2,3);
var myRotaryEncoder1 = new rotaryEncoder.RotaryEncoder(4,5);
var myRotaryEncoder2 = new rotaryEncoder.RotaryEncoder(6,7);
var myRotaryEncoder3 = new rotaryEncoder.RotaryEncoder(8,9);

var myInterval = setInterval(function(){
   	console.log("Encoder0: " + myRotaryEncoder0.position());
   	console.log("Encoder1: " + myRotaryEncoder1.position());
   	console.log("Encoder2: " + myRotaryEncoder2.position());
   	console.log("Encoder3: " + myRotaryEncoder3.position());
	}, 300);
  // When exiting: clear interval and print message
process.on('SIGNT', function(){
	clearInterval(myInterval);
	console.log("Exiting...");
        process.exit(0);
  	});

/* Joystick */
var joystick = require('jsupm_joystick12');
  // Instantiate a joystick on analog pins A0 and A1
var myJoystick = new joystick.Joystick12(2, 3);
 		 
  // Print the X and Y input values every second
setInterval(function()
{
    var XString = "Driving X:" + roundNum(myJoystick.getXInput(), 6);
    var YString = ": and Y:" + roundNum(myJoystick.getYInput(), 6);
    console.log(XString + YString);
}, 300); 		 				    	    	    		 
function roundNum(num, decimalPlaces)
{
    var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
    var numerator = Math.round((num + extraNum) * (Math.pow(10, decimalPlaces)));
    var denominator = Math.pow(10, decimalPlaces);
    return (numerator / denominator);
}
  	    	    	    		 
  // Print message when exiting
process.on('SIGINT', function()
{
    console.log("Exiting...");
    process.exit(0);
});

/* Monitor */
  // Load lcd module on I2C
var LCD = require('jsupm_i2clcd');

  // Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS)
var myLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);

setInterval(function(){
myLcd.setCursor(0,0);
// RGB Blue
//myLcd.setColor(53, 39, 249);
// RGB Red
myLcd.setColor(255, 0, 0);
myLcd.write('Hello World'); 
myLcd.setCursor(1,2);
},300);

/* Synth */
var enviro = flock.init();
var notes = {
    "c1":  440 * Math.pow(2, -9 / 12),
    "c#1": 440 * Math.pow(2, -8 / 12),
    "d1":  440 * Math.pow(2, -7 / 12),
    "d#1": 440 * Math.pow(2, -6 / 12),
    "e1":  440 * Math.pow(2, -5 / 12), 
    "f1":  440 * Math.pow(2, -4 / 12),
    "f#1": 440 * Math.pow(2, -3 / 12),
    "g1":  440 * Math.pow(2, -2 / 12),
    "g#1": 440 * Math.pow(2, -1 / 12),
    "a1":  440 * Math.pow(2,  0 / 12),
    "a#1": 440 * Math.pow(2,  1 / 12),
    "b1":  440 * Math.pow(2,  2 / 12),
    "c2":  440 * Math.pow(2,  3 / 12),
    "c#2": 440 * Math.pow(2,  4 / 12),
    "d2":  440 * Math.pow(2,  5 / 12),
    "d#2": 440 * Math.pow(2,  6 / 12),
    "e2":  440 * Math.pow(2,  7 / 12), 
};

var sources_num = 5; /* max */
var sources = [];
var sources_used = [];
var s = flock.synth({
    synthDef: {
    ugen: "flock.ugen.sum",
    sources: (function () {
        for (var i = 0; i < sources_num; i++) {
            sources_used[i] = null;
            sources[i] = {
                id: "osc" + i,
                ugen: "flock.ugen.sin",
                freq: 880,
                mul: {
                    ugen: "flock.ugen.envGen",
                    envelope: {
                        type: "flock.envelope.adsr",
                        attack: 0,
                        decay: 1.0,
			peak: 0.15,
                        sustain: 1.0,
                        release: 1.0,
                    },
                    gate: 0.0
                 }
            };
        }
        return sources;
    })()
  }
});
 
enviro.play();
 
function pressStart(key) {
     if (! (key in notes)) {
	 console.log("invalid key", key);
	 return;
     }
	     
     for (var i = 0; i < sources_num; i++) {
	 if (sources_used[i] == null) {
             sources_used[i] = key;
	     s.set("osc" + i + ".freq", notes[key]);
             s.set("osc" + i + ".mul.gate", 1.0);
             console.log("start", key, "osc: ", i);
             break;
          }
     }
}
 
function pressEnd(key) {
     if (! (key in notes)) {
        console.log("invalid key", key);
        return;
     }

     for (var i = 0; i < sources_num; i++) {
        if (sources_used[i] == key) {
            s.set("osc" + i + ".mul.gate", 0.0);
            sources_used[i] = null;
            console.log("end", key, "osc: ", i);
            break;							      
      	}
    }
}
