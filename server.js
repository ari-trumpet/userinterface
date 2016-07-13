"use strict";

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var os = require("os");

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

var pressStart = null;
var pressEnd = null;

io.on("connection", function (socket) {
    console.log("user connected");
    socket.on("pressStart", pressStart);
    socket.on("pressEnd", pressEnd);
});

function setCallback(ps, pe) {
    pressStart = ps;
    pressEnd = pe;
}

module.exports = {
    app: app,
    server: server,
    setCallback: setCallback
};
