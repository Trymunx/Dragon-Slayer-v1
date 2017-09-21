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
function Creature(creatureJson, key) {
  /* Are these all needed as part of this creature? */
  this.key = key;
	this.name = creatureJson["name"];
	this.namePlural = creatureJson["namePlural"];
	var jsonAttributes = creatureJson.attributes; //Could use ["attributes"] or just directly access
	this.attributes = {};
	/* Does this need to be inside an attributes object? */
	// Set creature totalHP and currentHP equeal to a random value between min and max HP values.
	this.attributes.totalHP = this.attributes.currentHP = Math.round(RNG(jsonAttributes.minTotalHP, jsonAttributes.maxTotalHP));
	this.attributes.aggressive = jsonAttributes.aggressive;
	this.attributes.healthBar = jsonAttributes.healthBar;
	/* Don't care about spawnchance etc. so leave it out
    "attributes": {
      "maxTotalHP": 50000,
      "minTotalHP": 15000,
      "totalHP": 0,
      "currentHP": 0,
      "healthBar": "#",
      "spawnChance": 0.15,
      "aggressive": true
    },*/
	this.attacks = creatureJson.attacks; //Copy entire object, as this is shared between all creatures (of this type)
  this.drops = creatureJson.drops; //Ditto
  this.messages = creatureJson.messages; //And again
	/* You can also declare functions as properties of the creature,
	 * and they will be per-creature functions
	 * (Which you probably don't want with the current implementation).
	 */
}

function newCreature (name) {
  return new Creature(CreatureDb[name], name);
}

module.exports = newCreature;