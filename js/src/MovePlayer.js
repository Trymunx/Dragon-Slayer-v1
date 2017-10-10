const Output = require("../Output.js");
const revealSurroundings = require("./RevealSurroundings.js");


function movePlayer(map, compassPoint, player) {
  var sideLength = Math.sqrt(map.length);

  var oldPlayerPos = player.position;

  switch(compassPoint) {
    case "north":
      if (map[(player.position - sideLength)].terrain === "river" || map[(player.position - sideLength)].terrain === "bridgeUpper" || map[(player.position - sideLength)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river. Try finding a bridge."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving North..."
        });
        player.position -= sideLength;
      }
      break;
    case "south":
      if (map[(player.position + sideLength)].terrain === "river" || map[(player.position + sideLength)].terrain === "bridgeUpper" || map[(player.position + sideLength)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river. Try finding a bridge."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving South..."
        });
        player.position += sideLength;
      }
      break;
    case "east":
      if (map[(player.position + 1)].terrain === "river" || map[(player.position + 1)].terrain === "bridgeUpper" || map[(player.position + 1)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving East..."
        });
        player.position++;
      }
      break;
    case "west":
      if (map[(player.position - 1)].terrain === "river" || map[(player.position - 1)].terrain === "bridgeUpper" || map[(player.position - 1)].terrain === "bridgeLower") {
        Output.addElement({
          "entity": "",
          "content": "You can't cross the river. Try finding a bridge."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "Moving West..."
        });
        player.position--;
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
  map[player.position].playerIsHere = true;
  map[player.position].playerHasSeen = true;

  revealSurroundings(player.position, map);

}

module.exports = movePlayer;