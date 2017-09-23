const getPlayerPosition = require("./PlayerPosition.js");
const Output = require("../Output.js");

function look(map) {
  var playerPos = getPlayerPosition(map);

  var sideLength = Math.sqrt(map.length);
  
  var north = { "position":(playerPos - sideLength), "name":"North" };
  var south = { "position":(playerPos + sideLength), "name":"South" };
  var east  = { "position":(playerPos + 1), "name":"East" };
  var west  = { "position":(playerPos - 1), "name":"West" };
  
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
    lookAdjacent(north);
    lookAdjacent(south);
    lookAdjacent(east);
  } else if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
    // Don't look East
    lookAdjacent(north);
    lookAdjacent(south);
    lookAdjacent(west);
  } else if (playerPos - sideLength < 0) { // Player is at top of map
    // Don't look North
    lookAdjacent(south);
    lookAdjacent(east);
    lookAdjacent(west);
  } else if (playerPos + sideLength > map.length) { // Player is at bottom of map
    // Don't look South
    lookAdjacent(north);
    lookAdjacent(east);
    lookAdjacent(west);
  } else { // Player is not at an edge
    lookAdjacent(north);
    lookAdjacent(south);
    lookAdjacent(east);
    lookAdjacent(west);
  }

  if (surroundingCreatures.length > 0) {
    Output.addElement({
      "entity": "",
      "content": "You can see a " + joinSurroundingCreatures(surroundingCreatures) + "."
    });
  } else {
    Output.addElement({
      "entity": "",
      "content": "You look around but see nothing but trees."
    });
  }

  function lookAdjacent(direction) {
    if (map[direction.position].creature) {
      surroundingCreatures.push(map[direction.position].creature.name + " to the " + direction.name);
    }
  }

}

module.exports = look;

function joinSurroundingCreatures(surroundingCreatures) {
  var lookOutput;
  if (surroundingCreatures.length > 1) {
    var lastCreature = surroundingCreatures.pop();
    
    lookOutput = surroundingCreatures.join(", a ");
    lookOutput += " and a " + lastCreature;
  } else {
    lookOutput = surroundingCreatures;
  }
  return lookOutput;
}