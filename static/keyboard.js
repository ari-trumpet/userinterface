var socket = io();

var currentKey = null;

document.addEventListener("DOMContentLoaded", function () {
    var $keys = document.querySelectorAll(".key");

    for (var i = 0, l = $keys.length; i < l; i++) {
        var kn = $keys[i].dataset.keyName;
        if (kn) {
            $keys[i].addEventListener("mousedown", keyPressStart.bind($keys[i], kn));
        }
    }
    document.addEventListener("mouseup", function () {
	    keyPressEnd(currentKey);
    });
});

var keyMap = {
    "A": "c1", "S": "d1", "D": "e1", "F": "f1",
    "G": "g1", "H": "a1", "J": "b1", "K": "c2",
    "L": "d2", ";": "e2",
    "W": "c#1", "E": "d#1", "T": "f#1", "Y": "g#1",
    "U": "a#1", "O": "c#2", "P": "d#2",
};

var keyState = {
    "c1": false,  "d1": false, "e1": false, "f1": false,
    "g1": false,  "a1": false, "b1": false, "c2": false,
    "d2": false,  "e2": false,
    "c1#": false, "d1#": false, "f1#": false, "g1#": false,
    "a1#": false, "c2#": false, "d2#": false,
};
window.addEventListener("keydown", function (e) {
    var k = String.fromCharCode(e.keyCode);
    if (k in keyMap) {
        keyPressStart(keyMap[k]);
    }
});

window.addEventListener("keyup", function (e) {
    var k = String.fromCharCode(e.keyCode);
    if (k in keyMap) {
        keyPressEnd(keyMap[k]);
    }
});

function keyPressStart(key) {
    if (keyState[key]) return;

    console.log("start", key);
    socket.emit("pressStart", key);
    keyState[key] = true;
    currentKey = key;
}

function keyPressEnd(key) {
    if (!keyState[key]) return;

    console.log("end", key);
    socket.emit("pressEnd", key);
    keyState[key] = false;
}
