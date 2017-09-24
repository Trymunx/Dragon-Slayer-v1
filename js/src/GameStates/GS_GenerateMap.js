const EventEmitter = require('events').EventEmitter;
const genMap = require("../GenerateMap.js");
const drawMap = require("../DrawMap.js");
const RNG = require("../utils/RNG.js");

var GS_GenerateMap = {};
var Player;

GS_GenerateMap.setPlayer = function (player) {
    Player = player;
}

GS_GenerateMap.runState = function (GameStateManager) {
    // var CurrentMap = genMap(Math.round(RNG(8, 20)));
    var CurrentMap = genMap(12)
    drawMap(CurrentMap);

    GameStateManager.emit("generated", {
      player: Player,
      map: CurrentMap
    });
}

module.exports = GS_GenerateMap;
