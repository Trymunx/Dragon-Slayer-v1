const getPlayerPosition = require("./PlayerPosition.js");
const DrawMap = require("./DrawMap.js");
const Look = require("./Look.js");
const Output = require("../Output.js");
const revealSurroundings = require("./RevealSurroundings.js");


function movePlayer(map, compassPoint) {
  var sideLength = Math.sqrt(map.length);

  var playerPos = getPlayerPosition(map);
  var oldPlayerPos = playerPos;

  switch(compassPoint) {
    case "north":
      if (map[(playerPos - sideLength)].terrain === "river" || map[(playerPos - sideLength)].terrain === "bridgeUpper" || map[(playerPos - sideLength)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river. Try finding a bridge."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving North..."
        });
        playerPos -= sideLength;
      }
      break;
    case "south":
      if (map[(playerPos + sideLength)].terrain === "river" || map[(playerPos + sideLength)].terrain === "bridgeUpper" || map[(playerPos + sideLength)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river. Try finding a bridge."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving South..."
        });
        playerPos += sideLength;
      }
      break;
    case "east":
      if (map[(playerPos + 1)].terrain === "river" || map[(playerPos + 1)].terrain === "bridgeUpper" || map[(playerPos + 1)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving East..."
        });
        playerPos++;
      }
      break;
    case "west":
      if (map[(playerPos - 1)].terrain === "river" || map[(playerPos - 1)].terrain === "bridgeUpper" || map[(playerPos - 1)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river. Try finding a bridge."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving West..."
        });
        playerPos--;
      }
      break;
    default:
      Output.addElement({
        "entity": "Error:",
        "content": "Direction not found. Please enter North, South, East or West."
      });
      break;
  }

  // Move player to the new position
  map[oldPlayerPos].playerIsHere = false;
  map[playerPos].playerIsHere = true;
  map[playerPos].playerHasSeen = true;

  revealSurroundings(playerPos, map);

}

module.exports = movePlayer;