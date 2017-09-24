const getPlayerPosition = require("./PlayerPosition.js");
const Output = require("../Output.js");

var surroundingCreatures = [];

function look(map, atWhat) {
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

  switch (atWhat) {
    case "AROUND":
      // Check for creatures to the North, South, East and West
            
      if (playerPos % sideLength === 0) { // Player is at left hand side of map
        // Don't look West
        lookAdjacent(map, north, south, east);
      } else if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
        // Don't look East
        lookAdjacent(map, north, south, west);
      } else if (playerPos - sideLength < 0) { // Player is at top of map
        // Don't look North
        lookAdjacent(map, south, east, west);
      } else if (playerPos + sideLength > map.length) { // Player is at bottom of map
        // Don't look South
        lookAdjacent(map, north, east, west);
      } else { // Player is not at an edge
        lookAdjacent(map, north, south, east, west);
      }
      break;
    case "NORTH":
      lookAdjacent(map, north);
      break;
    case "SOUTH":
      lookAdjacent(map, south);
      break;
    case "EAST":
      lookAdjacent(map, east);
      break;
    case "WEST":
      lookAdjacent(map, west);
      break;
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

function lookAdjacent(map, ...args) {
  for (let direction of args) {
    if (map[direction.position].creature) {
      surroundingCreatures.push(map[direction.position].creature.name + " to the " + direction.name);
    }
  }
  if (args.length > 1) {
    lookOutput("around");
  } else {
    lookOutput(args[0].name);
  }
}

function lookOutput(where) {
  if (surroundingCreatures.length > 0) {
    Output.addElement({
      "entity": "",
      "content": "You see a " + joinSurroundingCreatures(surroundingCreatures) + "."
    });
    surroundingCreatures = [];
  } else {
    Output.addElement({
      "entity": "",
      "content": "You look " + where + " but see nothing but trees."
    });
  }
}