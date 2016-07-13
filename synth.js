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

module.exports = {
    s: s,
    enviro: enviro,
    sources_used: sources_used,
    notes: notes
};
