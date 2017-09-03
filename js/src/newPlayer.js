const PlayerTemplate = require("./Player.json");
const getName = require("../src/utils/NameGenerator.js");


function newPlayer(name) {
  if (!name) {
    name = getName();
  }

  let player = PlayerTemplate;
  PlayerTemplate.name = name;

  return player;
}

module.exports = newPlayer;
