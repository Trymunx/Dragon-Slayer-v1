const GameState = require("./GameState.js");
const GameData = require("../GameData.js");
const genMap = require("../GenerateMap.js");
const drawMap = require("../DrawMap.js");
const RNG = require("../utils/RNG.js");

var GS_GenerateMap = new GameState(
  {event: "playerCreated", args: "none"},
  {event: "atNorthEdge", args: "south"},
  {event: "atSouthEdge", args: "north"},
  {event: "atEastEdge", args: "west"},
  {event: "atWestEdge", args: "east"}
);

GS_GenerateMap.runState = function (GameStateManager, edge) {
  // var CurrentMap = genMap(Math.round(RNG(8, 20)));
  GameData.currentMap = genMap(12, edge, GameData.player)
  drawMap(GameData.currentMap);

  GameStateManager.emit("generated");
}

module.exports = GS_GenerateMap;
