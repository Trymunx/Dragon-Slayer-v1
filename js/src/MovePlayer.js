const getPlayerPosition = require("./PlayerPosition.js");
const DrawMap = require("./DrawMap.js");
const Look = require("./Look.js");
const Output = require("../Output.js");

function movePlayer(map, compassPoint) {
  var sideLength = Math.sqrt(map.length);

  var playerPos = getPlayerPosition(map);
  var oldPlayerPos = playerPos;

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
  map[playerPos].playerHasSeen = true;

  var north = { "position":(playerPos - sideLength), "name":"North" };
  var south = { "position":(playerPos + sideLength), "name":"South" };
  var east  = { "position":(playerPos + 1), "name":"East" };
  var west  = { "position":(playerPos - 1), "name":"West" };

  if (playerPos % sideLength === 0) { // Player is at left hand side of map
    if (playerPos - sideLength < 0) { // Player is at top of map
      // Don't look North or West
      revealAdjacent(map, south, east);
    } else if (playerPos + sideLength > map.length) { // Player is at bottom of map
      // Don't look South or West
      revealAdjacent(map, north, east);
    }  else {
      // Don't look West
      revealAdjacent(map, north, south, east);
    }
  } else if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
    if (playerPos - sideLength < 0) { // Player is at top of map
      // Don't look North or East
      revealAdjacent(map, south, west);
    } else if (playerPos + sideLength > map.length) { // Player is at bottom of map
      // Don't look South or East
      revealAdjacent(map, north, west);
    }  else {
      // Don't look East
      revealAdjacent(map, north, south, west);
    }
  } else if (playerPos - sideLength < 0) { // Player is at top of map
    // Don't look North
    revealAdjacent(map, south, east, west);
  } else if (playerPos + sideLength > map.length) { // Player is at bottom of map
    // Don't look South
    revealAdjacent(map, north, east, west);
  } else { // Player is not at an edge
    revealAdjacent(map, north, south, east, west);
  }

  DrawMap(map);
  if (map[playerPos].creature) {
    Output.addElement({
      "entity": "",
      "content": "There is a " + map[playerPos].creature.name + " here."
    });
    
  }
}

module.exports = movePlayer;

function revealAdjacent(map, ...args) {
  for (let direction of args) {
    map[direction.position].playerHasSeen = true;
  }
}