"use strict"
const RNG = require("../src/utils/RNG.js");
const CreatureDb = require("../db/Creatures.json");

/** This is a function which has attributes set, so they can be accessed like an object.
  * It functions as a class.
  *
  * In this instance each time a new CreatureClass is called you don't need any
  * of the setup values (spawnchance, min/maxTotalHP etc.) so they aren't attached.
  * Other than that you can use this identically to the old method.
  */
class Creature {
  constructor(creatureJson, key, playerLevel) {
    /* Are these all needed as part of this creature? */
    this.key = key;
    this.level = Math.round(RNG(1, playerLevel * 1.5)); // Creature can be up to 1.5 times the player level
    // this.name = creatureJson["name"];
    // this.namePlural = creatureJson["namePlural"];
    var jsonAttributes = creatureJson.attributes; //Could use ["attributes"] or just directly access
    this.attributes = {};
    /* Does this need to be inside an attributes object? */
    // Set creature totalHP and currentHP equeal to a random value between min and max HP values.
    this.attributes.totalHP = this.attributes.currentHP = Math.round(RNG(jsonAttributes.minTotalHP, jsonAttributes.maxTotalHP) * (1 + ((this.level*this.level)/20)));
    this.attributes.aggressive = jsonAttributes.aggressive;
    this.attributes.healthBar = jsonAttributes.healthBar;
    this.attacks = creatureJson.attacks; //Copy entire object, as this is shared between all creatures (of this type)
    this.drops = creatureJson.drops; //Ditto
    this.messages = creatureJson.messages; //And again
  }
  get name() {
    return CreatureDb[this.key].name;
  }
  get namePlural() {
    return CreatureDb[this.key].namePlural;
  }
}

function newCreature (name, playerLevel) {
  return new Creature(CreatureDb[name], name, playerLevel);
}

module.exports = newCreature;