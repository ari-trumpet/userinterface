"use strict";

var server = require("./server.js");
var synth = require("./synth.js");

var s = synth.s;
var enviro = synth.enviro;

server.setCallback(synth.pressStart, synth.pressEnd);

//setup/Initialization for upm
var upm_groveSensor = require('jsupm_grove');
var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());

/* Button */
// Create the button object using GPIO pin 0
/*var button0 = new upm_groveSensor.GroveButton(0);
var button1 = new upm_groveSensor.GroveButton(3);
var button2 = new upm_groveSensor.GroveButton(5);
var button3 = new upm_groveSensor.GroveButton(7);
var groveRotary = new upm_groveSensor.GroveRotary(0);
*/

/* RotaryEncoder */
var rotaryEncoder = require("jsupm_rotaryencoder");
// Instantiate a Grove Rotary Encoder, using signal pins D2 and D3
var myRotaryEncoder0 = new rotaryEncoder.RotaryEncoder(2,3);
/*var myRotaryEncoder1 = new rotaryEncoder.RotaryEncoder(4,5);
var myRotaryEncoder2 = new rotaryEncoder.RotaryEncoder(6,7);
var myRotaryEncoder3 = new rotaryEncoder.RotaryEncoder(8,9);
*/

/* Joystick */
var joystick = require('jsupm_joystick12');
// Instantiate a joystick on analog pins A0 and A1
var myJoystick = new joystick.Joystick12(2, 3);
var joystick_x = null;
/* Monitor */
// Load lcd module on I2C
var LCD = require('jsupm_i2clcd');

// Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS)
var myLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);

setInterval(function(){
    
var para = myRotaryEncoder0.position();
    //console.log("E0 : "+para);
    myLcd.setCursor(0,1);
    if(para > 5){
    myLcd.write("Octave : 5");
    para = 5;
    myRotaryEncoder0.initPosition(5);    
    }else if(para <0){
    myRotaryEncoder0.initPosition(0);    
    para = 0;	    
    }else{	    
    synth.setOctave(Math.abs(para));
    myLcd.write("Octave : "+Math.abs(para));
    }
    // RGB Blue
    //myLcd.setColor(53, 39, 249);
    // RGB Red.(
/*    myLcd.setColor(255, 0, 0);
    myLcd.write('Hello World');
    myLcd.setCursor(1,2);
*//*    console.log(button0.name() + "0 value is " + button0.value());
    console.log(button1.name() + "1 value is " + button1.value());
    console.log(button2.name() + "2 value is " + button2.value());
    console.log(button3.name() + "3 value is " + button3.value());
*/
    // Rotary
//    var abs = groveRotary.abs_value();

    //write the knob value to the console in different formats

//    console.log("Volume: " + abs);
    //console.log("Rel: " + rel + " " + Math.round(parseInt(reldeg)) + " " + relrad.toFixed(3));

    // joystick
    var x = roundNum(myJoystick.getXInput(), 6);
    var xx = Math.max(-1, Math.min((x + 0.57) / 0.27 * 2 + 1, 1));

    if (joystick_x != x) {
        joystick_x = x;
        synth.setPitchDiff(xx);
    }

    var XString = "Driving X:" + x;
    var YString = ": and Y:" + roundNum(myJoystick.getYInput(), 6);
    //console.log(XString + YString);
  //  console.log("x", xx, "y", myJoystick.getYInput());

//    myLcd.setCursor(0,0);
    // RGB Blue
    //myLcd.setColor(53, 39, 249);
    // RGB Red
//    myLcd.setColor(255, 0, 0);
//    myLcd.write('WAVE: Saw   Square   Sign');
},100);

// When exiting: clear interval and print message
process.on('SIGNT', function(){
    clearInterval(myInterval);
    console.log("Exiting...");
    process.exit(0);
});

function roundNum(num, decimalPlaces)
{
    var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
    var numerator = Math.round((num + extraNum) * (Math.pow(10, decimalPlaces)));
    var denominator = Math.pow(10, decimalPlaces);
    return (numerator / denominator);
}
