const getPlayerPosition = require("./PlayerPosition.js");
const drawMap = require("./drawMap.js");
const look = require("./Look.js");

function movePlayer(map, direction) {
  var sideLength = Math.sqrt(map.length);

  var playerPos = getPlayerPosition(map);
  var oldPlayerPos = playerPos;

  switch(direction) {
    case "north":
      if (playerPos - sideLength < 0) {
        console.log("You can't move any further North!");
      } else if (map[(playerPos - sideLength)].terrain === "river" || map[(playerPos - sideLength)].terrain === "bridgeUpper" || map[(playerPos - sideLength)].terrain === "bridgeLower") {
        console.log("You can't cross the river.");
      } else {
        console.log("Moving North...");
        playerPos -= sideLength;
      }
      break;
    case "south":
      if (playerPos + sideLength > map.length) {
        console.log("You can't move any further South!");
      } else if (map[(playerPos + sideLength)].terrain === "river" || map[(playerPos + sideLength)].terrain === "bridgeUpper" || map[(playerPos + sideLength)].terrain === "bridgeLower") {
        console.log("You can't cross the river.");
      } else {
        console.log("Moving South...");
        playerPos += sideLength;
      }
      break;
    case "east":
      if ((playerPos + 1) % sideLength === 0) {
        console.log("You can't move any further East!");
      } else if (map[(playerPos + 1)].terrain === "river" || map[(playerPos + 1)].terrain === "bridgeUpper" || map[(playerPos + 1)].terrain === "bridgeLower") {
        Console.log("You can't cross the river.");
      } else {
        console.log("Moving East...");
        playerPos++;
      }
      break;
    case "west":
      if (playerPos % sideLength === 0) {
        console.log("You can't move any further West!");
      } else if (map[(playerPos - 1)].terrain === "river" || map[(playerPos - 1)].terrain === "bridgeUpper" || map[(playerPos - 1)].terrain === "bridgeLower") {
        Console.log("You can't cross the river.");
      } else {
        console.log("Moving West...");
        playerPos--;
      }
      break;
    default:
      console.log("Direction not found. Please enter north, south, east or west.");
      break;
    }

  // Move player to the new position
  map[oldPlayerPos].playerIsHere = false;
  map[playerPos].playerIsHere = true;

  look(map);
}

module.exports = movePlayer;
