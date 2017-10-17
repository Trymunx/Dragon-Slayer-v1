const GameState = require("./GameState.js");
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
var Player;

GS_GenerateMap.runState = function (GameStateManager, edge) {
  console.log(edge);
  // var CurrentMap = genMap(Math.round(RNG(8, 20)));
  var CurrentMap = genMap(12, edge, Player)
  drawMap(CurrentMap);

  GameStateManager.emit("generated", {
    player: Player,
    map: CurrentMap
  });
}

module.exports = GS_GenerateMap;
