const PlayerTemplate = require("../db/Player.json");
const genName = require("../src/utils/NameGenerator.js");
const CreatureDb = require("../db/Creatures.json");

class Inventory {
  constructor() {
    this.items = {};
    for (let item of PlayerTemplate.inventory) {
      this.items[item.key] = Object.assign({}, item);
    }
  }
  getItem(key) {
    return this.items[key];
  }
  * [Symbol.iterator]() {
    for (let item of Object.values(this.items)) {
      yield item;
    }
  }
}

class Player{
  constructor(name) {
    if (!name) {
    name = genName();
    }
    this.name = name;
    this.attributes = Object.assign({}, PlayerTemplate.attributes);
    this.attributes.currentHP = this.attributes.totalHP = (5 * this.attributes.level * this.attributes.level + 95);
    
    this.creaturesSlain = {};
    this.creaturesSlain.total = 0;
    this.creaturesSlain.byType = {};
    for (let key in CreatureDb) {
      this.creaturesSlain.byType[key] = 0;
    }
    
    this.inventory = new Inventory();
    
    // TODO: Fix equipment list
    this.equipped = Object.assign({}, PlayerTemplate.equipped);
  }

}

function newPlayer(name) {
  return new Player(name);
}

module.exports = newPlayer;
