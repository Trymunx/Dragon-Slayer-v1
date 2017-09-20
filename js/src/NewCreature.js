"use strict"
const RNG = require("../src/utils/RNG.js");
const CreatureDb = require("../db/Creatures.json");
const creatures = Object.keys(CreatureDb);

function Creature (name) {
  let creature = (CreatureDb[name]);
  // Set creature totalHP and currentHP equeal to a random value between min and max HP values.
  creature.attributes.totalHP = creature.attributes.currentHP = Math.round(RNG(creature.attributes.minTotalHP, creature.attributes.maxTotalHP));

  return creature;
}

module.exports = Creature;
