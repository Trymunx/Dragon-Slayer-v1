function DisplayInventory (player) {

  // Display item array with indentation
  var itemList;
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
    "  Gold: " + player.inventory.gold + "\n",
    "  Potions: " + player.inventory.potions + "\n",
    "  Items: " + itemList
  ];
  var inventoryString = "";
  for (let i in inventory) {
    inventoryString += inventory[i];
  }

  document.getElementById("inventory").innerHTML = inventoryString;
}

module.exports = DisplayInventory;
