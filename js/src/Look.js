const getPlayerPosition = require("./PlayerPosition.js");
const Output = require("../Output.js");

var sideLength = Math.sqrt(map.length);

function look(map) {
  var playerPos = getPlayerPosition(map);

  if (map[playerPos].creature) {
    let creatureName = map[playerPos].creature.name;
    Output.addElement({
      "entity": "",
      "content": "There is a " + creatureName + " here."
    });
    // console.log("There is a " + map[playerPos].creature.name + " here.");
  } else if (map[playerPos].terrain === "bridge") {
    Output.addElement({
      "entity": "",
      "content": "You are standing on a bridge."
    });
    // console.log("You are standing on a bridge.");
  } else {
    Output.addElement({
      "entity": "",
      "content": "You look around but see nothing but trees."
    });
    // console.log("You look around but see nothing but trees.");
  }

  
  // Check for creatures to the North, South, East and West

  if (playerPos % sideLength === 0) { // Player is at left hand side of map
    // Don't look West
  } else if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
    // Don't look East
  } else if (playerPos - sideLength < 0) { // Player is at top of map
    // Don't look North
  } else if (playerPos + sideLength > map.length) { // Player is at bottom of map
    // Don't look South
  }

}

module.exports = look;
