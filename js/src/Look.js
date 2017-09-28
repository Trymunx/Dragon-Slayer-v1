const getPlayerPosition = require("./PlayerPosition.js");
const Output = require("../Output.js");

var surroundingsOutput = [];

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
    case "around":
      // Check for creatures to the North, South, East and West
            
      if (playerPos % sideLength === 0) { // Player is at LHS of map
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
    case "north":
      if (playerPos - sideLength < 0) { // Player is at top of map
        // Just display empty tile message
        lookOutput("north");
      } else {
        lookAdjacent(map, north);
      }
      break;
    case "south":
      if (playerPos + sideLength > map.length) { // Player is at bottom of map
        // Just display empty tile message
        lookOutput("south");
      } else {
        lookAdjacent(map, south);
      }
      break;
    case "east":
      if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
        // Just display empty tile message
        lookOutput("east");
      } else {
        lookAdjacent(map, east);
      }
      break;
    case "west":
      if (playerPos % sideLength === 0) { // Player is at LHS of map
        // Just display empty tile message
        lookOutput("west");
      } else {
        lookAdjacent(map, west);
      }
      break;
  } 

}

module.exports = look;

function joinSurroundingsOutput(surroundingsOutput) {
  var lookOutput;
  if (surroundingsOutput.length > 1) {
    var lastCreature = surroundingsOutput.pop();
    
    lookOutput = surroundingsOutput.join(", a ");
    lookOutput += " and a " + lastCreature;
  } else {
    lookOutput = surroundingsOutput;
  }
  return lookOutput;
}

function lookAdjacent(map, ...args) {
  for (let direction of args) {
    if (map[direction.position].creature) {
      surroundingsOutput.push("level " + map[direction.position].creature.level + " " + map[direction.position].creature.name + " to the " + direction.name);
    } else if (map[direction.position].terrain === "river" || map[direction.position].terrain === "bridgeUpper" || map[direction.position].terrain === "bridgeLower") {
      surroundingsOutput.push("river to the " + direction.name);
    } else if (map[direction.position].terrain === "bridge") {
      surroundingsOutput.push("bridge to the " + direction.name);
    }
  }
  if (args.length > 1) {
    lookOutput("around");
  } else {
    lookOutput(args[0].name);
  }
}

function lookOutput(where) {
  if (surroundingsOutput.length > 0) {
    Output.addElement({
      "entity": "",
      "content": "You see a " + joinSurroundingsOutput(surroundingsOutput) + "."
    });
    surroundingsOutput = [];
  } else {
    Output.addElement({
      "entity": "",
      "content": "You look " + where + " but see nothing but trees."
    });
  }
}