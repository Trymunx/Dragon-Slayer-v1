const GameState = require("./GameState.js");
const GameData = require("../GameData.js");
const Output = require("../../Output.js");
const Input_Text = document.getElementById("input-text");
const RNG = require("../utils/RNG");
const dimRNG = require("../utils/DimRNG.js");
const DisplayInventory = require("../DisplayInventory.js");
const ItemDb = require("../../db/Items.json");

var GS_Fight = new GameState("fight");

var commands = [
  "attack",
  "hit",
  "potion",
  "drink potion",
  "run"
];

GS_Fight.runState = function (GameStateManager, data) {
  var creature = data.creature;
  var aggressor = data.aggressor;
  // Receive command
  function fightCommands(e) {
    if (e.keyCode === 13) {
      e.preventDefault();

      let text = Input_Text.value;

      if (text) {
        Output.addElement({
          "entity": GameData.player.name,
          "content": text
        });
        // Parse and process command
        var command = text.toLowerCase().split(" ");
        switch (command[0]) {
          case "attack":
          case "hit":
            /* if (command.length > 2 && command[1] === "the" && command[2] !== Creature.name) {
              Output.addElement({
                "entity": "",
                "content": "Attack the what? I don't know what the " + command.slice(2).join(" ") + " is."
              });
            } else  */if (command.length > 2 && command.slice(1).join(" ") !== creature.name) {
              Output.addElement({
                "entity": "",
                "content": "There isn't a " + command.slice(1).join(" ") + " to attack!"
              });
            } else {
              // Is the creature alive?
              if (creature.attributes.currentHP > 0) {
                playerAttack(creature);
                // Is the creature still alive after player's attack?
                if (creature.attributes.currentHP <= 0) {
                  GameData.getPlayerTile().creature = null;
                  GameStateManager.emit("win");

                  Input_Text.removeEventListener("keydown", fightCommands);
                } else {
                  creatureAttack(creature);
                  if (GameData.player.attributes.currentHP <= 0) {
                    GameStateManager.emit("slain");

                    Input_Text.removeEventListener("keydown", fightCommands);
                  }
                }
              } else {
                Output.addElement({
                  "entity": "Error:",
                  "content": "It's already dead. Attacking it won't help."
                });
                GameData.getPlayerTile().creature = null;
                GameStateManager.emit("win");

                Input_Text.removeEventListener("keydown", fightCommands);
              }/* 
              // Is the creature still alive?
              if (Creature.attributes.currentHP > 0) {
                creatureAttack(Creature);
                if (Player.attributes.currentHP <= 0) {
                  GameStateManager.emit("slain", {
                      player: Player
                  });

                  Input_Text.removeEventListener("keydown", fightCommands);
                }
              } else {
                CurrentMap[Player.position].creature = null;
                GameStateManager.emit("win", {
                  player: Player,
                  map: CurrentMap
                });

                Input_Text.removeEventListener("keydown", fightCommands);
              } */
            }
            break;
          case "drink":
            drinkPotion();
            if (creature.attributes.currentHP > 0) {
              creatureAttack(creature);
              if (GameData.player.attributes.currentHP <= 0) {
                GameStateManager.emit("slain");

                Input_Text.removeEventListener("keydown", fightCommands);
              }
            } else {
              GameData.getPlayerTile().creature = null;
              GameStateManager.emit("win");

              Input_Text.removeEventListener("keydown", fightCommands);
            }
            break;
          case "potion":
            drinkPotion();
            if (creature.attributes.currentHP > 0) {
              creatureAttack(creature);
              if (GameData.player.attributes.currentHP <= 0) {
                GameStateManager.emit("slain");

                Input_Text.removeEventListener("keydown", fightCommands);
              }
            } else {
              GameData.getPlayerTile().creature = null;
              GameStateManager.emit("win");

              Input_Text.removeEventListener("keydown", fightCommands);
            }
            break;
          case "run":
            if (creature.attributes.aggressive && (2 * RNG(creature.attributes.currentHP)) > RNG(creature.attributes.totalHP)) {
              Output.addElement({
                "entity": "",
                "content": "The " + creature.name + " stops you from running away!"
              });
              if (creature.attributes.currentHP > 0) {
                creatureAttack(creature);
                if (GameData.player.attributes.currentHP <= 0) {
                  GameStateManager.emit("slain");

                  Input_Text.removeEventListener("keydown", fightCommands);
                }
              } else {
                GameData.getPlayerTile().creature = null;
                GameStateManager.emit("win");

                Input_Text.removeEventListener("keydown", fightCommands);
              }
            } else {
              Output.addElement({
                "entity": "",
                "content": "You manage to get away!"
              });

              // Stop creatures from regaining full HP after you run away
              GameData.getPlayerTile().creature.attributes.currentHP = creature.attributes.currentHP;
              GameStateManager.emit("run");

              Input_Text.removeEventListener("keydown", fightCommands);
            }
            break;
          default:
            Output.addElement({
              "entity": "Error:",
              "content": "At this time, you can only enter [attack / drink potion / run]."
            });
            break;
        }
      }

      Input_Text.value = "";

    } else if (e.keyCode === 9) {
      let text = Input_Text.value;
      Input_Text.value = tabComplete(text);
    }

  }

  if (aggressor === "player") {
    if (creature.attributes.currentHP > 0) {
      playerAttack(creature);
      // Is the creature still alive after player's attack?
      if (creature.attributes.currentHP <= 0) {
        GameData.getPlayerTile().creature = null;
        GameStateManager.emit("win");
      } else {
        Input_Text.addEventListener("keydown", fightCommands);
      }
    }
  } else { // Aggressor is creature
    creatureAttack(creature);
    if (GameData.player.attributes.currentHP <= 0) {
      GameStateManager.emit("slain");
    } else {
      Input_Text.addEventListener("keydown", fightCommands);
    }
  }

}

module.exports = GS_Fight;

function playerAttack(creature) {
  // Player attack chance is based on level: (x + 2) / (x + 5) (Gives result from x=1, chance=0.5 to x->inf, chance->1), for chance=0.95, x=55
  if (RNG() < ((GameData.player.attributes.level + 2) / (GameData.player.attributes.level + 5))) {
    let levelDiff = GameData.player.attributes.level - creature.level;
    let calcDmgVal = RNG(1, ((GameData.player.attributes.strength / 1.5) * GameData.player.attributes.level));
    let damage;
    if (levelDiff > 0) {// Player is above creature level: levelDiff is positive
      damage = Math.round(calcDmgVal * (1.25 + Math.log2(levelDiff) / 4));
    } else if (levelDiff < 0) {
      damage = Math.round(calcDmgVal * Math.pow((0.95 / -levelDiff), 0.125));
    } else {
      damage = Math.round(calcDmgVal);
    }
    creature.attributes.currentHP -= damage;
    Output.addElement({
      "entity": "",
      "content": "You attack the " + creature.name + " for " + damage + "HP."
    });
    GameData.player.attributes.strEXP++;
    while (GameData.player.attributes.strEXP > Math.round(2 * Math.pow(GameData.player.attributes.strength, 1.8))) {
      GameData.player.attributes.strEXP -= Math.round(2 * Math.pow(GameData.player.attributes.strength, 1.8));
      GameData.player.attributes.strength++;
      Output.addElement({
        "entity": "",
        "content": "<span class='level-strength'>Congratulations!\nYour strength is now level " + GameData.player.attributes.strength + ".</span>"
      });
    }
  } else {
    Output.addElement({
      "entity": "",
      "content": "You miss the " + creature.name + "."
    });
  }
  creatureHPReport(creature);
}

function creatureHPReport(creature) {
  if (creature.attributes.currentHP > 0) {
    Output.addElement({
      "entity": "",
      "content": "It has " + creature.attributes.currentHP + "HP remaining."
    });
    creatureHPBar(creature);
  } else {
    let messagePicker = Math.round(RNG(creature.messages.onDeath.length - 1));
    Output.addElement({
      "entity": "",
      "content": creature.messages.onDeath[messagePicker] + "\nYou have " + GameData.player.attributes.currentHP + "HP remaining."
    });
    if (creature !== "dragon") { GameData.player.creaturesSlain.slainNonDragon = true; }
    GameData.player.creaturesSlain.total++;
    GameData.player.creaturesSlain.byType[creature.key]++;
    creatureDrop(creature);
    playerExperienceGain(creature);
  }
}

function creatureDrop(creature) {
  let goldDrop;
  let goldDropMiddleValue;
  let goldDropLowerBound;
  let goldDropUpperBound;
  if (RNG() <= creature.drops.gold.dropChance) {
    goldDrop = dimRNG(1, creature.drops.gold.max);
    // Player.inventory.gold += goldDrop;
    GameData.getPlayerTile().items.push({ "key": "gold", "quantity": goldDrop, "stackValue": goldDrop * ItemDb["gold"].value });
  } else {
    goldDrop = false;
  }
  let potionDrop;
  if (RNG() <= creature.drops.potions.dropChance) {
    potionDrop = dimRNG(1, creature.drops.potions.max);
    GameData.getPlayerTile().items.push({ "key": "potion", "quantity": potionDrop, "stackValue": potionDrop * ItemDb["potion"].value });
    // Player.inventory.potions += potionDrop;
  } else {
    potionDrop = false;
  }
  if (goldDrop === false && potionDrop === false) {
    Output.addElement({
      "entity": "",
      "content": "The " + creature.name + " doesn't drop anything."
    });
  } else if (potionDrop === false) {
    Output.addElement({
      "entity": "",
      "content": "The " + creature.name + " drops " + goldDrop + " gold."
    });
  } else if (goldDrop === false) {
    Output.addElement({
      "entity": "",
      "content": "The " + creature.name + " drops " + potionDrop + (potionDrop === 1 ? " potion." : " potions.")
    });
  } else {
    Output.addElement({
      "entity": "",
      "content": "The " + creature.name + " drops " + goldDrop + " gold and " + potionDrop + (potionDrop === 1 ? " potion." : " potions.")
    });
  }
  // Drop items on ground
  // if (creature.drops.equipment.length > 0) {
  //   drops.push({
  //     "item": creature.drops.equipment[RNG(creature.drops.equipment.length - 1)],
  //     "quantity": 1
  //   });
  // }
  // for (let item of creature.drops.items) {
  //   drops.push({
  //     "item": item,
  //     "quantity": 1
  //   });
  // }

  DisplayInventory(GameData.player);
}

function creatureHPBar(creature) {
  let totalBarLength;
  let hitpointsPercent = Math.round((creature.attributes.currentHP / creature.attributes.totalHP) * 100);
  let barLength;
  let emptyLength;
  let bar = "";

  /* if (creature.attributes.totalHP <= 1000) { // Weaker creatures need HP bars that aren't 0 length
    totalBarLength = Math.round(Math.sqrt(creature.attributes.totalHP) * 3.5);
    barLength = Math.round((totalBarLength / 100) * hitpointsPercent);
    emptyLength = totalBarLength - barLength;
  } else {  */// Is a dragon or a troll so use cube root instead of square root
  totalBarLength = Math.round(Math.pow(creature.attributes.totalHP, 1 / 4) * 8);
  barLength = Math.round((totalBarLength / 100) * hitpointsPercent);
  emptyLength = totalBarLength - barLength;
  /* } */

  for (let i = 0; i < barLength; i++) {
    bar += creature.attributes.healthBar;
  }

  for (let i = 0; i < emptyLength; i++) {
    bar += " "
  }

  Output.addElement({
    "entity": "",
    "content": "[<span class='hp-bar-foe'>" + bar + "</span>] (" + hitpointsPercent + "%)"
  });
}

function pickCreatureAttack(creature) {
  let attackRoll = [];
  // Rough random picker based on creatures attack chances
  for (let i = 0; i < creature.attacks.length; i++) {
    // Multiplies their attack chances by a random number
    attackRoll[i] = RNG() * creature.attacks[i].chance;
  }
  // attackIndex is the position in the creature's attacks array
  let attackIndex = 0;
  // indexValue is the value of that position in the attackRoll array
  let indexValue = attackRoll[attackIndex];
  for (let i = 0; i < attackRoll.length; i++) {
    if (attackRoll[i] > indexValue) {
      // If the value of the next attackRoll index is greater, change the attackIndex to that creature
      attackIndex = i;
      indexValue = attackRoll[i];
    }
  }
  return creature.attacks[attackIndex];
}

function creatureAttack(creature) {
  let attack = pickCreatureAttack(creature);
  let damage;
  if (attack.name === "miss") {
    damage = 0;
    let messagePicker = RNG();
    if (messagePicker < 0.35) {
      Output.addElement({
        "entity": creature.name,
        "content": "You raise your shield and block the " + creature.name + "'s attack."
      });
    } else if (messagePicker < 0.60) {
      Output.addElement({
        "entity": creature.name,
        "content": "You sidestep the " + creature.name + "'s attack."
      });
    } else {
      Output.addElement({
        "entity": creature.name,
        "content": "The " + creature.name + "'s attack misses you."
      });
    }
    playerHPReport(GameData.player);
  } else {
    let levelDiff = creature.level - GameData.player.attributes.level;
    let calcDmgVal = RNG(attack.minDamage, attack.maxDamage) * creature.level / 1.5;
    if (levelDiff > 0) {// Creature is above player level: levelDiff is positive
      damage = Math.round(calcDmgVal * (1.25 + Math.log2(levelDiff) / 4));
    } else if (levelDiff < 0) {// Creature is below player level: levelDiff is negative
      damage = Math.round(calcDmgVal * Math.pow((0.95 / -levelDiff), 0.125));
    } else {
      damage = Math.round(calcDmgVal);
    }
    let messagePicker = (attack.messages.length > 1) ? Math.round(RNG(attack.messages.length - 1)) : 0;
    Output.addElement({
      "entity": creature.name,
      "content": attack.messages[messagePicker] + damage + "HP."
    });
    GameData.player.attributes.currentHP -= damage;
    playerHPReport(GameData.player);
  }
}

function playerHPReport(player) {
  if (player.attributes.currentHP > 0) {
    Output.addElement({
      "entity": "",
      "content": "You have " + player.attributes.currentHP + "HP remaining."
    });
    playerHPBar(player);
  } else {
    Output.addElement({
      "entity": "",
      "content": "You have been slain."
    });
  }
  DisplayInventory(player);
}

function playerHPBar(player) {
  // let totalBarLength = Math.round(0.6 * player.attributes.totalHP);
  let totalBarLength = Math.round(Math.pow(player.attributes.totalHP, 1 / 4) * 8);
  let hitpointsPercent = Math.round((player.attributes.currentHP / player.attributes.totalHP) * 100);
  let barLength = Math.round((totalBarLength / 100) * hitpointsPercent);
  let emptyLength = totalBarLength - barLength;
  let bar = "";
  for (let i = 0; i < barLength; i++) {
    bar += "|"
  }
  for (let i = 0; i < emptyLength; i++) {
    bar += " "
  }
  // Change colour based on HP percentage
  if (hitpointsPercent > 25) {
    Output.addElement({
      "entity": "",
      "content": "[<span class='hp-bar-player'>" + bar + "</span>] (" + hitpointsPercent + "%)"
    });
  } else if (hitpointsPercent > 10) {
    Output.addElement({
      "entity": "",
      "content": "[<span class='hp-bar-warning'>" + bar + "</span>] (" + hitpointsPercent + "%)"
    });
  } else {
    Output.addElement({
      "entity": "",
      "content": "[<span class='hp-bar-foe'>" + bar + "</span>] (" + hitpointsPercent + "%)"
    });
  }
}

function drinkPotion() {
  if (GameData.player.isFullHealth) {
    Output.addElement({
      "entity": "",
      "content": "You already have full health!"
    });
  } else {
    let potions = GameData.player.inventory.getItem("potion");
    if (potions.quantity > 0) {
      let amountHealed = GameData.player.heal(Math.round(50 + GameData.player.attributes.level * GameData.player.attributes.level));
      potions.quantity--;
      Output.addElement({
        "entity": "",
        "content": "You drink a potion, restoring " + amountHealed + "HP. You have " + potions.quantity + " potions remaining."
      });
      DisplayInventory(GameData.player);
    } else {
      Output.addElement({
        "entity": "",
        "content": "You have no potions left to drink!"
      });
    }
  }
  playerHPReport(GameData.player);
}

function playerExperienceGain(creature) {
  GameData.player.attributes.experience += Math.round(creature.attributes.totalHP * 0.35)
  while (GameData.player.attributes.experience >= Math.round(50 * Math.pow(GameData.player.attributes.level, 1.3))) {
    GameData.player.attributes.experience -= Math.round(50 * Math.pow(GameData.player.attributes.level, 1.3));
    let prevHP = GameData.player.attributes.totalHP;
    GameData.player.attributes.totalHP = 5 * (GameData.player.attributes.level * GameData.player.attributes.level) + 95;
    GameData.player.attributes.currentHP += GameData.player.attributes.totalHP - prevHP;
    GameData.player.attributes.level++;
    Output.addElement({
      "entity": "",
      "content": "<span class='level-up'>Congratulations!\nYou are now level " + GameData.player.attributes.level + ".</span>"
    });
  }
  DisplayInventory(GameData.player);
}

function tabComplete(text) {
  text = text.toLowerCase();

  matchedCommands = [];

  for (let command of commands) {
    let possible = true;

    let i = 0;
    while (i < command.length && i < text.length) {
      if (text.charAt(i) === command.charAt(i)) {
        i++;
      } else {
        possible = false;
        break;
      }
    }

    if (possible) {
      matchedCommands.push(command);
    }
  }

  return matchedCommands;
}