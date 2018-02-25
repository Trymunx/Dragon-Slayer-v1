const PlayerTemplate = require("../db/Player.json");
const genName = require("../src/utils/NameGenerator.js");
const CreatureDb = require("../db/Creatures.json");
const Output = require("../Output.js")

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
  addItem(item) {
    let key = item.key;
    let quantity = item.quantity;
    if (this.items[key]) { //TODO: check if that's how you find whether an item key is already present
      this.items[key].quantity += quantity;
    } else {
      this.items[key] = Object.assign({ "key": key, "quantity": quantity });
    }
  }
  removeItem(item) {
    let key = item.key;
    let quantity = item.quantity;
    if (this.items[key] && this.items[key].quantity - quantity > 0) {
      this.items[key].quantity -= quantity;
    } else {
      delete this.items[key];
    }
  }
  *[Symbol.iterator]() {
    for (let item of Object.values(this.items)) {
      yield item;
    }
  }
}

class Player {
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
  get isFullHealth() {
    return this.attributes.currentHP >= this.attributes.totalHP;
  }
  heal(amount, simulate) {
    var amountHealed;
    if (this.isFullHealth) {
      amountHealed = 0; // Don't heal at full HP
    }
    let newHP = this.attributes.currentHP + amount;
    if (newHP > this.attributes.totalHP) {
      amountHealed = this.attributes.totalHP - this.attributes.currentHP;
      newHP = this.attributes.totalHP;
    } else {
      amountHealed = amount;
    }
    if (!simulate) {
      this.attributes.currentHP = newHP;
    }
    return amountHealed;
  }
  get expToNextLevel() {
    return Math.round(50 * Math.pow(this.attributes.level, 1.3));
  }

  slotIsEmpty(slot) {
    return this.equipped[slot] === "None";
  }

  equipItem(item, slot) {
    if (!slot) {
      slot = item.equipSlots.find(slot => this.equipped[slot] === "None") || item.equipSlots[0];
    }
    if (!item.equipSlots.includes(slot)) {
      Output.addElement({
        "entity": "",
        "content": "Item " + item.name + " won't fit in slot " + slot
      });
    } else if (this.slotIsEmpty(slot)) {
      this.equipped[slot] = item.name;
    } else {
      Output.addElement({
        "entity": "",
        "content": "Replaced " + this.equipped[slot] + " with " + item.name
      });
      this.equipped[slot] = item.name;
    }
  }

  unequipItem(item, slot) {
    if (!slot) {
      // We reverse array to remove items from least important slot first
      slot = item.equipSlots.slice(0).reverse().find(slot => this.equipped[slot] === item.name);
    }
    if (!slot || this.equipped[slot] !== item.name) {
      Output.addElement({
        "entity": "",
        "content": "You don't have a " + item.name + " to unequip."
      });
    } else {
      this.equipped[slot] = "None";
      this.inventory.addItem(item);
    }
  }
}

function newPlayer(name) {
  return new Player(name);
}

module.exports = newPlayer;
