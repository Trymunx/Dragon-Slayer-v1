const getPlayerPosition = require("./PlayerPosition.js");
const Output = require("../Output.js");

function look(map) {
  var playerPos = getPlayerPosition(map);

  var sideLength = Math.sqrt(map.length);
  
  var north = playerPos - sideLength;
  var south = playerPos + sideLength;
  var east  = playerPos + 1;
  var west  = playerPos - 1;
  
  if (map[playerPos].creature) {
    Output.addElement({
      "entity": "",
      "content": "There is a " + map[playerPos].creature.name + " here."
    });
  } else if (map[playerPos].terrain === "bridge") {
    Output.addElement({
      "entity": "",
      "content": "You are standing on a bridge."
    });
  }

  // Check for creatures to the North, South, East and West
  var surroundingCreatures = [];
  
  if (playerPos % sideLength === 0) { // Player is at left hand side of map
    // Don't look West
    lookNorth();
    lookSouth();
    lookEast();
  } else if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
    // Don't look East
    lookNorth();
    lookSouth();
    lookWest();
  } else if (playerPos - sideLength < 0) { // Player is at top of map
    // Don't look North
    lookSouth();
    lookEast();
    lookWest();
  } else if (playerPos + sideLength > map.length) { // Player is at bottom of map
    // Don't look South
    lookNorth();
    lookEast();
    lookWest();
  } else { // Player is not at an edge
    lookNorth();
    lookSouth();
    lookEast();
    lookWest();
  }

  if (surroundingCreatures.length > 0) {
    Output.addElement({
      "entity": "",
      "content": "You can see a " + surroundingCreatures.join(", a ") + "."
    });
  } else {
    Output.addElement({
      "entity": "",
      "content": "You look around but see nothing but trees."
    });
  }

  function lookNorth() {
    if (map[north].creature) {
      surroundingCreatures.push(map[north].creature.name + " to the North");
    }
  }
  function lookSouth() {
    if (map[south].creature) {
      surroundingCreatures.push(map[south].creature.name + " to the South");
    }
  }
  function lookEast() {
    if (map[east].creature) {
      surroundingCreatures.push(map[east].creature.name + " to the East");
    }
  }
  function lookWest() {
    if (map[west].creature) {
      surroundingCreatures.push(map[west].creature.name + " to the West");
    }
  }

}

module.exports = look;