var flock = require("flocking");

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

var pitch_diff = 0;

var sources_num = 5; /* max */
var sources = [];
var sources_used = [];
var waves = ["sin", "squareOsc", "sawOsc"];
var ratio = [1, 1, 1];
//var waves = ["sin"];
//var ratio = [1];

var s = flock.synth({
    synthDef: {
        ugen: "flock.ugen.sum",
        sources: (function () {
            for (var i = 0; i < sources_num; i++) {
                sources_used[i] = null;
                sources[i] = {
                   ugen: "flock.ugen.sum",
                   sources: waves.map(function (wave, j) {
                       console.log("osc" + i + "-" + j);
                       return {
                           id: "osc" + i + "-" + j,
                           ugen: "flock.ugen." + wave,
                           freq: 880,
                           mul: {
                               ugen: "flock.ugen.envGen",
                               envelope: {
                                   type: "flock.envelope.adsr",
                                   attack: 0,
                                   decay: 1.0,
                                   peak: 0.10,
                                   sustain: 1.0,
                                   release: 1.0,
                               },
                               gate: 0.0,
                               mul: 1,
                           }
                       };
                   }),
                };
            }
            return sources;
        })()
    }
});


function pressStart(key) {
    if (! (key in notes)) {
        console.log("invalid key", key);
        return;
    }

    for (var i = 0; i < sources_num; i++) {
        if (sources_used[i] == null) {
            sources_used[i] = key;
            for (var j = 0; j < waves.length; j++) {
                s.set("osc" + i + "-" + j + ".mul.mul", ratio[j]);
                s.set("osc" + i + "-" + j + ".freq", notes[key] * Math.pow(2, pitch_diff / 12));
                s.set("osc" + i + "-" + j + ".mul.gate", 1.0);
            }
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
            sources_used[i] = null;
            for (var j = 0; j < waves.length; j++) {
                s.set("osc" + i + "-" + j + ".mul.gate", 0.0);
            }
            console.log("end", key, "osc: ", i);
            break;
        }
    }
}

function setPitchDiff(x) { /* -1 < x < 1 */
    pitch_diff = x;
    for (var i = 0; i < sources_num; i++) {
        if (sources_used[i] == null) break;
        var key = sources_used[i];

        for (var j = 0; j < waves.length; j++) {
            s.set("osc" + i + "." + j + ".freq", notes[key] * Math.pow(2, x / 12));
        }
    }
}

function setRatio(j, r) {
    ratio[j] = r;
    for (var i = 0; i < sources_num; i++) {
        if (sources_used[i] == null) break;
        s.set("osc" + i + "-" + j + ".mul.mul", ratio[j]);
    }
}

enviro.play();

module.exports = {
    s: s,
    enviro: enviro,
    pressStart: pressStart,
    pressEnd: pressEnd,
    setPitchDiff: setPitchDiff,
    setRatio: setRatio
};
