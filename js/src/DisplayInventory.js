const ItemsDb = require("../db/Items.json");
const toBar = require("./utils/CompletionBar.js");


function DisplayInventory(player) {

  // Display inventory with indentation
  var inventoryString =
    "Equipped items:\n" +
    "  Head: " + player.equipped.head + "\n" +
    "  Torso: " + player.equipped.torso + "\n" +
    "  Legs: " + player.equipped.legs + "\n" +
    "  Right hand: " + player.equipped.rightHand + "\n" +
    "  Left hand: " + player.equipped.leftHand + "\n" +
    "  Gloves: " + player.equipped.gloves + "\n" +
    "  Boots: " + player.equipped.boots + "\n" +
    "\n" +
    "Inventory:\n";
  // "  Gold: <span class='gold'>" + player.inventory.gold + "</span>\n",
  // "  Potions: <span class='potions'>" + player.inventory.potions + "</span>\n",
  // "  Items: " + itemList

  for (let item of player.inventory) {
    if (item.quantity >= 1) {
      let name = item.quantity > 1 ? ItemsDb[item.key].namePlural : ItemsDb[item.key].name;
      inventoryString += "  " + item.quantity + " " + name + "\n";
    }
  }

  var levelDisplay = "Level: " + player.attributes.level;
  var expBar = toBar({
    totalLength: 32,
    value: player.attributes.experience,
    totalValue: player.expToNextLevel,
    leftEnd: "[",
    rightEnd: "]",
    char: "=",
    endChar: ">"
  });

  let hpPC = player.attributes.currentHP / player.attributes.totalHP;
  var hpChar;
  if (hpPC > 0.25) {
    hpChar = "<span class='hp-bar-player'>|</span>";
  } else if (hpPC > 0.1) {
    hpChar = "<span class='hp-bar-warning'>|</span>";
  } else {
    hpChar = "<span class='hp-bar-foe'>|</span>";
  }
  var hpBar = toBar({
    totalLength: 32,
    value: player.attributes.currentHP,
    totalValue: player.attributes.totalHP,
    leftEnd: "[",
    rightEnd: "]",
    char: hpChar
  });

  var HPDisplay;
  if (hpPC > 0.25) {
    HPDisplay = "HP: <span class='hp-bar-player'>" + player.attributes.currentHP + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";
  } else if (hpPC > 0.1) {
    HPDisplay = "HP: <span class='hp-bar-warning'>" + player.attributes.currentHP + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";
  } else if (player.attributes.currentHP > 0) {
    HPDisplay = "HP: <span class='hp-bar-foe'>" + player.attributes.currentHP + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";
  } else {
    HPDisplay = "HP: <span class='hp-bar-foe'>" + 0 + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";
  }

  var PanelContent = HPDisplay + "\t" + hpBar + "\n\n" + levelDisplay + "\t" + expBar + "\n\n" + inventoryString;
  document.getElementById("inventory").innerHTML = PanelContent;
}

module.exports = DisplayInventory;
