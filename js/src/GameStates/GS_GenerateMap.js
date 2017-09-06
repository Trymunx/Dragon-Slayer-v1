const EventEmitter = require('events').EventEmitter;
const genMap = require("../GenerateMap.js");
const drawMap = require("../DrawMap.js");
const RNG = require("../utils/RNG.js");

var GS_GenerateMap = new EventEmitter();
var Player;

GS_GenerateMap.setPlayer = function (player) {
    Player = player;
}

GS_GenerateMap.runState = function () {
    var CurrentMap = genMap(Math.round(RNG(5, 16)));
    drawMap(CurrentMap);

    GS_GenerateMap.emit("generated", {
      player: Player,
      map: CurrentMap
    });
}

module.exports = GS_GenerateMap;
