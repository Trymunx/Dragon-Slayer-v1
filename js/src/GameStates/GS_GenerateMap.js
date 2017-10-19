const GameState = require("./GameState.js");
const GameData = require("../GameData.js");
const genMap = require("../GenerateMap.js");
const drawMap = require("../DrawMap.js");
const RNG = require("../utils/RNG.js");

var GS_GenerateMap = new GameState("playerCreated", "atMapEdge");

GS_GenerateMap.runState = function (GameStateManager, data) {
  // var CurrentMap = genMap(Math.round(RNG(8, 20)));
  var edge = data && data.edge ? data.edge : "none";
  GameData.currentMap = genMap(12, edge, GameData.player)
  drawMap(GameData.currentMap);

  GameStateManager.emit("generated");
}

module.exports = GS_GenerateMap;
