const getPlayerPosition = require("./PlayerPosition.js");
const Output = require("../Output.js");

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
}

module.exports = look;
