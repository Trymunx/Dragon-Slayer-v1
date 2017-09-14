const getPlayerPosition = require("./PlayerPosition.js");
const DrawMap = require("./DrawMap.js");
const Look = require("./Look.js");
const Output = require("../Output.js");

function movePlayer(map, direction) {
  var sideLength = Math.sqrt(map.length);

  var playerPos = getPlayerPosition(map);
  var oldPlayerPos = playerPos;
  var compassPoint;

  switch (direction) {
    case "up":
      compassPoint = "north";
      break;
    case "down":
      compassPoint = "south";
      break;
    case "right":
      compassPoint = "east";
      break;
    case "left":
      compassPoint = "west";
      break;
    default:
      compassPoint = direction;
  }

  switch(compassPoint) {
    case "north":
      if (playerPos - sideLength < 0) {
        Output.addElement({
          "entity": "",
          "content": "You can't move any further North!"
        });
      } else if (map[(playerPos - sideLength)].terrain === "river" || map[(playerPos - sideLength)].terrain === "bridgeUpper" || map[(playerPos - sideLength)].terrain === "bridgeLower") {
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
      if (playerPos + sideLength > map.length) {
        Output.addElement({
          "entity": "",
          "content": "You can't move any further South!"
        });
      } else if (map[(playerPos + sideLength)].terrain === "river" || map[(playerPos + sideLength)].terrain === "bridgeUpper" || map[(playerPos + sideLength)].terrain === "bridgeLower") {
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
      if ((playerPos + 1) % sideLength === 0) {
        Output.addElement({
          "entity": "",
          "content": "You can't move any further East!"
        });
      } else if (map[(playerPos + 1)].terrain === "river" || map[(playerPos + 1)].terrain === "bridgeUpper" || map[(playerPos + 1)].terrain === "bridgeLower") {
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
      if (playerPos % sideLength === 0) {
        Output.addElement({
          "entity": "",
          "content": "You can't move any further West!"
        });
      } else if (map[(playerPos - 1)].terrain === "river" || map[(playerPos - 1)].terrain === "bridgeUpper" || map[(playerPos - 1)].terrain === "bridgeLower") {
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

  DrawMap(map);
  Look(map);
}

module.exports = movePlayer;
