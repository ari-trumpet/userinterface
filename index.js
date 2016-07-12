"use strict";

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var os = require("os");
var flock = require("flocking");

/* Server */

app.use(express.static("static"));

app.get("/", function (req,res) {
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
				
				console.log("keyboard is at http://" + host + ":" + port + "/");
});

io.on("connection", function (socket) {
				console.log("user connected");
				socket.on("pressStart", pressStart);
				socket.on("pressEnd", pressEnd);
});

/* Synth */
var enviro = flock.init();
var notes = {
		"c1":			440 * Math.pow(2, -9 / 12),
		"c#1":		440 * Math.pow(2, -8 / 12),
		"d1":			440 * Math.pow(2, -7 / 12),
		"d#1":		440 * Math.pow(2, -6 / 12),
		"e1":			440 * Math.pow(2, -5 / 12), /*
		"f1":			440 * Math.pow(2, -4 / 12),
		"f#1":		440 * Math.pow(2, -3 / 12),
		"g1":			440 * Math.pow(2, -2 / 12),
		"g#1":		440 * Math.pow(2, -1 / 12),
		"a1":			440 * Math.pow(2,  0 / 12),
		"a#1":		440 * Math.pow(2,  1 / 12),
		"b1":			440 * Math.pow(2,  2 / 12),
		"c2":			440 * Math.pow(2,  3 / 12),
		"c#2":		440 * Math.pow(2,  4 / 12),
		"d2":			440 * Math.pow(2,  5 / 12),
		"d#2":		440 * Math.pow(2,  6 / 12),
		"e2":			440 * Math.pow(2,  7 / 12), */
};

var s = flock.synth({
		synthDef: {
				ugen: "flock.ugen.sum",
				sources: (function () {
						var keys = Object.keys(notes);
						return keys.map(function (key) {
								return {
											id: key,
											ugen: "flock.ugen.sin",
											freq: notes[key],
											mul: {
													ugen: "flock.ugen.envGen",
													envelope: {
															type: "flock.envelope.adsr",
															attack: 0,
															decay: 0.1,
															sustain: 0.1,
															release: 0.1,
															peak: 0.15,
													},
													gate: 0.0
											}
									};
							});
					})()
		}
});

enviro.play();

function pressStart(key) {
				if (key in notes)
								s.set(key + ".mul.gate", 0.5);
				}
				
				console.log("start", key);
}

function pressEnd(key) {
				if (key in notes) {
								s.set(key + ".mul.gate", 0.0);
				}
				console.log("end", key);
}
		
				
