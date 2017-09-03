const getPlayerPosition = require("./PlayerPosition.js");

function look(map) {
  var playerPos = getPlayerPosition(map);

  if (map[playerPos].creature) {
    console.log("There is a " + map[playerPos].creature.name + " here.");
  } else if (map[playerPos].terrain === "bridge") {
    console.log("You are standing on a bridge.");
  } else {
    console.log("You look around but see nothing but trees.");
  }
}

module.exports = look;
