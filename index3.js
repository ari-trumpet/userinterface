"use strict";

var server = require("./server.js");
var synth = require("./synth.js");

var s = synth.s;
var enviro = synth.enviro;
var sources_used = synth.sources_used;
var notes = synth.notes;

server.setCallback(synth.pressStart, synth.pressEnd);

//setup/Initialization for upm
var upm_groveSensor = require('jsupm_grove');
var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());

/* Button */
// Create the button object using GPIO pin 0
var button0 = new upm_groveSensor.GroveButton(0);
var button1 = new upm_groveSensor.GroveButton(3);
var button2 = new upm_groveSensor.GroveButton(5);
var button3 = new upm_groveSensor.GroveButton(7); //var button3 = new upm_groveSensor.GroveButton(3);
// Read the input and print, waiting one second between readings

buttonloop();

function buttonloop(){
   /* console.log(button0.name() + "0 value is " + button0.value());
    console.log(button1.name() + "1 value is " + button1.value());
    console.log(button2.name() + "2 value is " + button2.value());
    console.log(button3.name() + "3 value is " + button3.value());
*/
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

   // console.log("Volume: " + abs);
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
   /* console.log("Encoder0: " + myRotaryEncoder0.position());
    console.log("Encoder1: " + myRotaryEncoder1.position());
    console.log("Encoder2: " + myRotaryEncoder2.position());
    console.log("Encoder3: " + myRotaryEncoder3.position());
*/}, 300);
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
var joystick_x = null;
setInterval(function()
{
	/*
    var x = roundNum(myJoystick.getXInput(), 6);

    if (joystick_x != x) {
        joystick_x = x;
        //synth.setPitchDiff(Math.max(-1, Math.min(x / 0.17, 1)));
    }

    var XString = "Driving X:" + x;
    var YString = ": and Y:" + roundNum(myJoystick.getYInput(), 6);
    */
   // console.log(XString + YString);
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
   // var p0 = myRotaryEncoder0.position();
   // var p1 = myRotaryEncoder1.position();
   // var p2 = myRotaryEncoder2.position();
    myLcd.setColor(255, 0, 0);
    myLcd.write('WAVE: Saw');
   /* myLcd.setCursor(9,7);
    myLcd.write(p1);
    myLcd.write(9,10);
    myLcd.write(p2);
    myLcd.write(9,22);
    myLcd.write(p3);
    */
},300);
