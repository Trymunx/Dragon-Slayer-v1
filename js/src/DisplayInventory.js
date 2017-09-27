function DisplayInventory (player) {

  // Display item array with indentation
  var itemList = [""];
  for (let i in player.inventory.items) {
    itemList[i] = "\n    " + player.inventory.items[i];
  }

  // Display inventory with indentation
  var inventory = [
    "Equipped items:\n",
    "  Head: " + player.equipped.head + "\n",
    "  Torso: " + player.equipped.torso + "\n",
    "  Legs: " + player.equipped.legs + "\n",
    "  Right hand: " + player.equipped.rightHand + "\n",
    "  Left hand: " + player.equipped.leftHand + "\n",
    "  Gloves: " + player.equipped.gloves + "\n",
    "  Boots: " + player.equipped.boots + "\n",
    "\n",
    "Inventory:\n",
    "  Gold: <span class='gold'>" + player.inventory.gold + "</span>\n",
    "  Potions: <span class='potions'>" + player.inventory.potions + "</span>\n",
    "  Items: " + itemList
  ];
  var inventoryString = "";
  for (let i in inventory) {
    inventoryString += inventory[i];
  }

  var levelDisplay = "Level: " + player.attributes.level;
  let totalExpBarLength = 30;
  let expPercent = (player.attributes.experience/Math.round(50 * Math.pow(player.attributes.level, 1.3)));
  let expBarLength = Math.round(expPercent * totalExpBarLength);
  let emptyLength = totalExpBarLength - expBarLength;
  var expBar = "["
  for (let i = 0; i < expBarLength; i++) {
    expBar += "=";
  };
  expBar += ">"
  for (let i = 0; i < emptyLength; i++) {
    expBar += " ";
  }
  expBar += "]";

  var HPDisplay;
  if (player.attributes.currentHP / player.attributes.totalHP > 0.25) {
    HPDisplay = "HP: <span class='hp-bar-player'>" + player.attributes.currentHP + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";    
  } else if (player.attributes.currentHP / player.attributes.totalHP > 0.1) {
    HPDisplay = "HP: <span class='hp-bar-warning'>" + player.attributes.currentHP + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";
  } else if (player.attributes.currentHP > 0) {
    HPDisplay = "HP: <span class='hp-bar-foe'>" + player.attributes.currentHP + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";        
  } else {
    HPDisplay = "HP: <span class='hp-bar-foe'>" + 0 + "</span> / <span class='hp-bar-player'>" + player.attributes.totalHP + "</span>";
  }
  var PanelContent = HPDisplay + "\n\n" + levelDisplay + "\t" + expBar + "\n\n" + inventoryString;
  document.getElementById("inventory").innerHTML = PanelContent;
}

module.exports = DisplayInventory;
