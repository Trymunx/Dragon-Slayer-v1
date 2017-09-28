const PlayerTemplate = require("../db/Player.json");
const getName = require("../src/utils/NameGenerator.js");
const CreatureDb = require("../db/Creatures.json");


function newPlayer(name) {
  if (!name) {
    name = getName();
  }

  let player = PlayerTemplate;
  player.name = name;
  player.attributes.level = 1;
  player.attributes.experience = 0;
  player.attributes.currentHP = player.attributes.totalHP = (5 * player.attributes.level * player.attributes.level + 95);
  player.creaturesSlain.total = 0;
  player.creaturesSlain.byType = {};
  for (let key in CreatureDb) {
    player.creaturesSlain.byType[key] = 0;
  }

  return player;
}

module.exports = newPlayer;
