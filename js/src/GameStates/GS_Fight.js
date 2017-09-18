const Output = require("../../Output.js");
const Input_Text = document.getElementById("input-text");
const RNG = require("../utils/RNG");
const dimRNG = require("../utils/DimRNG.js");
const PlayerPosition = require("../PlayerPosition.js");
const DisplayInventory = require("../DisplayInventory.js");

var GS_Fight = {};
var Player;
var Creature;
var CurrentMap;

GS_Fight.setPlayer = function (player) {
  Player = player;
}

GS_Fight.setCreature = function (creature) {
  Creature = creature;
}

GS_Fight.setMap = function (map) {
  CurrentMap = map;
}

GS_Fight.runState = function (GameStateManager) {
  
  var playerPos = PlayerPosition(CurrentMap);

  // Receive command
  function option (e) {
    if (e.keyCode === 13) {
      e.preventDefault();

      let text = Input_Text.value;

      if (text) {
        Output.addElement({
          "entity": Player.name,
          "content": text
        });
        console.log("Input received:", text);
        // Parse and process command
        var command = text.toUpperCase().split(" ");
        switch (command[0]) {
          case "ATTACK":
            if (Creature.attributes.currentHP > 0) {
              playerAttack(Creature);
            } else {
              Output.addElement({
                "entity": "Error:",
                "content": "It's already dead. Attacking it won't help."
              })
            }
            if (Creature.attributes.currentHP > 0) {
              creatureAttack(Creature);
              if (Player.currentHP <= 0) {
                GameStateManager.emit("slain", {
                    player: Player
                });

                Input_Text.removeEventListener("keydown", option);
              }
            } else {
              CurrentMap[playerPos].creature = null;
              GameStateManager.emit("win", {
                player: Player,
                map: CurrentMap
              });

              Input_Text.removeEventListener("keydown", option);
            }
            break;
          case "DRINK":
            drinkPotion();
            if (Creature.attributes.currentHP > 0) {
              creatureAttack(Creature);
              if (Player.currentHP <= 0) {
                GameStateManager.emit("slain", {
                    player: Player
                });

                Input_Text.removeEventListener("keydown", option);
              }
            } else {
              CurrentMap[playerPos].creature = null;
              GameStateManager.emit("win", {
                player: Player,
                map: CurrentMap
              });

              Input_Text.removeEventListener("keydown", option);
            }
            break;
          case "POTION":
            drinkPotion();
            if (Creature.attributes.currentHP > 0) {
              creatureAttack(Creature);
              if (Player.currentHP <= 0) {
                GameStateManager.emit("slain", {
                    player: Player
                });

                Input_Text.removeEventListener("keydown", option);
              }
            } else {
              CurrentMap[playerPos].creature = null;
              GameStateManager.emit("win", {
                player: Player,
                map: CurrentMap
              });

              Input_Text.removeEventListener("keydown", option);
            }
            break;
          case "HEAL":
            heal();
            if (Creature.attributes.currentHP > 0) {
              creatureAttack(Creature);
              if (Player.currentHP <= 0) {
                GameStateManager.emit("slain", {
                    player: Player
                });

                Input_Text.removeEventListener("keydown", option);
              }
            } else {
              CurrentMap[playerPos].creature = null;
              GameStateManager.emit("win", {
                player: Player,
                map: CurrentMap
              });

              Input_Text.removeEventListener("keydown", option);
            }
            break;
          case "RUN":
            if (Creature.attributes.aggressive) {
              Output.addElement({
                "entity": "",
                "content": "The " + Creature.name + " stops you from running away!"
              });
            } else {
              // Stop creatures from regaining full HP after you run away
              CurrentMap[playerPos].creature.attributes.currentHP = Creature.attributes.currentHP;
              GameStateManager.emit("run", {
                player: Player,
                map: CurrentMap
              });

              Input_Text.removeEventListener("keydown", option);
            }
            break;
          default:
            Output.addElement({
              "entity": "Error:",
              "content": "At this time, you can only enter [ATTACK / DRINK POTION / HEAL / RUN]."
            });
            break;
        }
      }

      Input_Text.value = "";
    }
  }

  // Initialise above function
  Input_Text.addEventListener("keydown", option);
  
}

module.exports = GS_Fight;

function playerAttack(creature) {
  if (RNG() < Player.attributes.attackChance) {
    let damage = Math.round(RNG(1, Player.attributes.maxDamage));
    creature.attributes.currentHP -= damage;
    Output.addElement({
      "entity": "",
      "content": "You attack the " + creature.name + " for " + damage + "HP."
    });
  } else {
    Output.addElement({
      "entity": "",
      "content": "You miss the " + creature.name + "."
    });
  }
  creatureHPReport(creature);
}

function creatureHPReport (creature) {
  if (creature.attributes.currentHP > 0) {
    Output.addElement({
      "entity": "",
      "content": "It has " + creature.attributes.currentHP + "HP remaining."
    });
    creatureHPBar(creature);
  } else {
    Output.addElement({
      "entity": "",
      "content": "You have slain the " + creature.name + ". You have " + Player.attributes.currentHP + "HP remaining."
    });
    Player.creaturesSlain.total++;
    Player.creaturesSlain.byType[creature.name].totalSlain++;
    creatureDrop(creature);
  }
}

function creatureDrop(creature) {
  let goldDrop;
  let goldDropMiddleValue;
  let goldDropLowerBound;
  let goldDropUpperBound;
  if (RNG() <= creature.drops.gold.dropChance) {
    goldDrop = dimRNG(1, creature.drops.gold.max);
    Player.inventory.gold += goldDrop;
  } else {
    goldDrop = false;
  }
  let potionDrop;
  if (RNG() <= creature.drops.potions.dropChance) {
    potionDrop = dimRNG(1, creature.drops.potions.max);
    Player.potions += potionDrop;
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
  DisplayInventory(Player);
}

function creatureHPBar(creature) {
  let totalBarLength;
  let hitpointsPercent = Math.round((creature.attributes.currentHP / creature.attributes.totalHP) * 100);
  let barLength;
  let emptyLength;
  let bar = "";

  if (creature.attributes.totalHP <= 1000) { // Weaker creatures need HP bars that aren't 0 length
    totalBarLength = Math.round(Math.sqrt(creature.attributes.totalHP) * 3.5);
    barLength = Math.round((totalBarLength / 100) * hitpointsPercent);
    emptyLength = totalBarLength - barLength;
  } else { // Is a dragon or a troll so use cube root instead of square root
    totalBarLength = Math.round(Math.cbrt(creature.attributes.totalHP) * 3.25);
    barLength = Math.round((totalBarLength / 100) * hitpointsPercent);
    emptyLength = totalBarLength - barLength;
  }

  for (let i = 0; i < barLength; i++) {
    bar += creature.attributes.healthBar;
  }

  for (let i = 0; i < emptyLength; i++) {
    bar += " "
  }

  Output.addElement({
    "entity": "",
    "content": "<p class='hp-bar-foe'>[" + bar + "] (" + hitpointsPercent + "%)</p>"
  });
}

function getCreatureAttack(creature) {
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
  let attack = getCreatureAttack(creature);
  let damage;
  if (attack.name === "miss") {
    damage = 0;
    let messagePicker = RNG();
    if(messagePicker < 0.35){
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
    playerHPReport(Player.attributes.currentHP);
  } else {
    damage = Math.round(RNG(attack.minDamage, attack.maxDamage));
    let messagePicker = Math.round(RNG(attack.messages.length-1));
    Output.addElement({
      "entity": creature.name,
      "content": attack.messages[messagePicker] + damage + "HP."
    });
    Player.attributes.currentHP -= damage;
    playerHPReport(Player.attributes.currentHP);
  }
}

function playerHPReport(playerHP) {
  if (playerHP > 0) {
    Output.addElement({
      "entity": "",
      "content": "You have " + playerHP + "HP remaining."
    });
    playerHPBar(playerHP);
    DisplayInventory(Player);
  } else {
    Output.addElement({
      "entity": "",
      "content": "You have been slain."
    });
  }
}

function playerHPBar(playerHP) {
  let barLength = Math.round(0.6 * playerHP);
  let emptyLength = 60 - barLength;
  let bar = "";
  for (let i = 0; i < barLength; i++) {
    bar += "|"
  }
  for (let i = 0; i < emptyLength; i++) {
    bar += " "
  }
  Output.addElement({
    "entity": "",
    "content": "<p class='hp-bar-player'>[" + bar + "] (" + playerHP + "%)</p>"
  });
}

function drinkPotion() {
  if (Player.inventory.potions > 0) {
    Player.attributes.currentHP += 50;
    Player.inventory.potions--;
    Output.addElement({
      "entity": "",
      "content": "You drink a potion, restoring 50HP. You have " + Player.inventory.potions + " potions remaining."
    });    
    DisplayInventory(Player);
  } else {
    Output.addElement({
      "entity": "",
      "content": "You have no potions left to drink!"
    });
  }
  playerHPReport(Player.attributes.currentHP);
}

function heal() {
  let healing = Math.round(RNG(1, 8));
  Player.attributes.currentHP += healing;
  Output.addElement({
    "entity": "",
    "content": "You tend to your wounds as best you can, healing " + healing + "HP."
  });
  playerHPReport(Player.attributes.currentHP);
}