const MovePlayer = require("../MovePlayer.js");
const EventEmitter = require("events").EventEmitter;
const Input_Text = document.getElementById("input-text");
const Output = require("../../Output.js");
const DrawMap = require("../DrawMap.js");
const Look = require("../Look.js");
const DisplayInventory = require("../DisplayInventory.js");
const RNG = require("../utils/RNG.js");
const ItemDb = require("../../db/Items.json");


var GS_OffPath = {};
var Player;
var CurrentMap;
var sideLength;
var GameStateManager;

var commands = [
  "attack",
  "fight",
  "move",
  "walk",
  "go",
  "north",
  "south",
  "east",
  "west",
  "look",
  "rest",
  "potion",
  "drink potion"
];

var directions = [
  "around",
  "north",
  "south",
  "east",
  "west"
]

GS_OffPath.setPlayer = function (player) {
  Player = player;
}

GS_OffPath.setMap = function (map) {
  CurrentMap = map;
  sideLength = Math.sqrt(map.length);
}

GS_OffPath.includeGSManager = function (gsManager) {
  GameStateManager = gsManager;
}

// Receive command
function getInputAndParse(e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    let text = Input_Text.value;

    if (text) {
      Output.addElement({
        "entity": Player.name,
        "content": text
      });
      // Parse and process command
      // Parse(text, Player, CurrentMap);

      var command = text.toLowerCase().split(" ");

      commandParse(command, 0)
      // Input_Text.removeEventListener("keydown", getInputAndParse);
    }

    Input_Text.value = "";
    // tabCompletion.enteredText = "";
    // tabCompletion.currentIndex = 0;

  } else if (e.keyCode === 37) { // Left arrow key
    e.preventDefault();
    commandParse(["west"], 0);
  } else if (e.keyCode === 38) { // Up arrow key
    e.preventDefault();
    commandParse(["north"], 0);
  } else if (e.keyCode === 39) { // Right arrow key
    e.preventDefault();
    commandParse(["east"], 0);
  } else if (e.keyCode === 40) { // Down arrow key
    e.preventDefault();
    commandParse(["south"], 0);
  } else if (e.keyCode === 9) {
    let text = Input_Text.value;
    Input_Text.value = tabComplete(text);


    // } else if (e.keyCode === 9) {
    //   let text = Input_Text.value;
    //   if (text === "") {
    //     validCompletions = commands.slice();
    //   } else {
    //     if (validCompletions.length === 0) {
    //       var command = text.toLowerCase().split("");
    //       var validCompletions = [];
    //       for (let option in commands) {
    //         if (option.startsWith(text)) {
    //           validCompletions.push(option);
    //         }
    //       }
    //       Input_Text.value = validCompletions[]
    //     } else {
    //       validCompletions.shift();
    //     }
    //   }
  }
}

GS_OffPath.runState = function () {

  DrawMap(CurrentMap, Player);
  // Initialise above function
  Input_Text.addEventListener("keydown", getInputAndParse);



}

module.exports = GS_OffPath;


function commandParse(input, index) {
  switch (input[index]) {
    case "attack":
    case "fight":
      if (CurrentMap[Player.position].creature) {
        Input_Text.removeEventListener("keydown", getInputAndParse);
        let messagePicker = Math.round(RNG(CurrentMap[Player.position].creature.messages.onSpawn.length - 1));
        Output.addElement({
          "entity": "",
          "content": CurrentMap[Player.position].creature.messages.onSpawn[messagePicker]
        });
        GameStateManager.emit("fight", {
          player: Player,
          map: CurrentMap,
          creature: CurrentMap[Player.position].creature
        });

      } else {
        Output.addElement({
          "entity": "Error:",
          "content": "There's nothing here to attack!"
        });
      }
      break;
    case "walk":
    case "move":
    case "go":
      if (directions.includes(input[1])) {
        commandParse(input, 1);
      } else {
        Output.addElement({
          "entity": "",
          "content": input[0] + " where?"
        });
      }
      break;
    case "north":
      // Player position before move: check if at North edge
      if (Player.position - sideLength < 0) {
        Output.addElement({
          "entity": "",
          "content": "Walking North, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atNorthEdge", {
          player: Player
        });
      } else {
        MovePlayer(CurrentMap, "north", Player);
        DrawMap(CurrentMap, Player);
        if (CurrentMap[Player.position].creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + CurrentMap[Player.position].creature.name + " here."
          });

        }
        if (CurrentMap[Player.position].creature && CurrentMap[Player.position].creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "south":
      //Player position before move: check if at South edge
      if (Player.position + sideLength >= CurrentMap.length) {
        Output.addElement({
          "entity": "",
          "content": "Walking South, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atSouthEdge", {
          player: Player
        });
      } else {
        MovePlayer(CurrentMap, "south", Player);
        DrawMap(CurrentMap, Player);
        if (CurrentMap[Player.position].creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + CurrentMap[Player.position].creature.name + " here."
          });

        }
        if (CurrentMap[Player.position].creature && CurrentMap[Player.position].creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "east":
      //Player position before move: check if at East edge
      if ((Player.position + 1) % sideLength === 0) {
        Output.addElement({
          "entity": "",
          "content": "Walking East, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atEastEdge", {
          player: Player
        });
      } else {
        MovePlayer(CurrentMap, "east", Player);
        DrawMap(CurrentMap, Player);
        if (CurrentMap[Player.position].creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + CurrentMap[Player.position].creature.name + " here."
          });

        }
        if (CurrentMap[Player.position].creature && CurrentMap[Player.position].creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "west":
      //Player position before move: check if at West edge
      if (Player.position % sideLength === 0) {
        Output.addElement({
          "entity": "",
          "content": "Walking West, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atWestEdge", {
          player: Player
        });
      } else {
        MovePlayer(CurrentMap, "west", Player);
        DrawMap(CurrentMap, Player);
        if (CurrentMap[Player.position].creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + CurrentMap[Player.position].creature.name + " here."
          });

        }
        if (CurrentMap[Player.position].creature && CurrentMap[Player.position].creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "look":
      if (directions.includes(input[1])) {
        Look(CurrentMap, input[1], Player);
        DrawMap(CurrentMap, Player);
      } else if (input[1] === "at") {
        commandParse(["look", input[2]], 0);
      } else {
        Output.addElement({
          "entity": "",
          "content": "Look at what? Try a direction, or \"look around\" for the surroundings."
        });

      }
      break;
    case "potion":
      drinkPotion();
      break;
    case "drink":
      if (input[1] === "potion") {
        drinkPotion();
      } else if (input.length > 1) {
        Output.addElement({
          "entity": "",
          "content": "You can't drink the " + input[1].toLowerCase() + "!"
        });
      } else {
        Output.addElement({
          "entity": "Error:",
          "content": "Drink what?"
        });
      }
      break;
    case "rest":
      if (Player.hasRested) {
        Output.addElement({
          "entity": "",
          "content": "You already feel well rested, resting more will not help you."
        });
      } else {
        rest();
      }
      break;
    case "take":
      if (CurrentMap[Player.position].items) {
        var itemNames = [];
        for (let item in CurrentMap[Player.position].items) {
          itemNames.push(ItemDb[CurrentMap[Player.position].items[item].key].name);
          itemNames.push(ItemDb[CurrentMap[Player.position].items[item].key].namePlural);
        }
        if (itemNames.includes(input[1])) {
          let index = Math.floor(itemNames.indexOf(input[1]));
          for (let item in Player.inventory) {
            if (itemNames.includes(Player.inventory[item].name)) {
              Player.inventory[item].quantity += CurrentMap[Player.position].items[index].quantity;
            } else {
              Player.inventory.push(CurrentMap[Player.position].items[index]);
            }
          }
          CurrentMap[Player.position].items.splice(index, 1);
        } else if (input[1] === "all" || input[1] === undefined) {
          Player.inventory.push(CurrentMap[Player.position].items);
        } else {
          Output.addElement({
            "entity": "",
            "content": "There isn't a " + input[1] + " here to take."
          });
        }
      } else {
        Output.addElement({
          "entity": "",
          "content": "There isn't anything here to take."
        });
      }
      break;
    case "restart":
      Input_Text.removeEventListener("keydown", getInputAndParse);
      GameStateManager.emit("start");
      break;
    case "?":
    case "help":
      Output.addElement({
        "entity": "Help:",
        "content": "To move, enter compass directions or use the arrow keys. Enter [ attack ] to fight a creature, [ look ] to see what's around you and [ NEW MAP ] to spawn in a new map."
      });
      break;
    // case "NEW":
    //   if (input[1] === "MAP") {
    //     GameStateManager.emit("playerCreated", {
    //       player: Player
    //     });
    //   } else {
    //     Output.addElement({
    //       "entity": "Error:",
    //       "content": "I don't know what a new " + input[1].toLowerCase() + " is!"
    //     });
    //   }
    //   break;
    default:
      Output.addElement({
        "entity": "Error:",
        "content": "Unknown command, type \"help\" or \"?\" for help."
      });
  }
}

function enterAttackState() {
  // Aggressive creatures attack on sight
  Input_Text.removeEventListener("keydown", getInputAndParse);
  let messagePicker = Math.round(RNG(CurrentMap[Player.position].creature.messages.onSpawn.length - 1));
  Output.addElement({
    "entity": "",
    "content": CurrentMap[Player.position].creature.messages.onSpawn[messagePicker]
  });
  GameStateManager.emit("fight", {
    player: Player,
    map: CurrentMap,
    creature: CurrentMap[Player.position].creature
  });
}

function drinkPotion() {
  if (Player.attributes.currentHP >= Player.attributes.totalHP) {
    Output.addElement({
      "entity": "",
      "content": "You already have full health!"
    });
  } else {
    if (Player.inventory.getItem("potion").quantity > 0) {
      let healing = (Math.min(Math.round(50 + Player.attributes.level * Player.attributes.level), Player.attributes.totalHP - Player.attributes.currentHP));
      Player.attributes.currentHP += healing;
      Player.inventory.getItem("potion").quantity--;
      Output.addElement({
        "entity": "",
        "content": "You drink a potion, restoring " + healing + "HP. You have " + Player.inventory.getItem("potion").quantity + " potions remaining."
      });
      DisplayInventory(Player);
    } else {
      Output.addElement({
        "entity": "",
        "content": "You have no potions left to drink!"
      });
    }
  }
}

function rest() {
  if (Player.attributes.currentHP >= Player.attributes.totalHP) { // Don't heal at full HP
    Output.addElement({
      "entity": "",
      "content": "You already have full health!"
    });
  } else if (Player.attributes.currentHP >= Player.attributes.totalHP - (0.08 * Player.attributes.totalHP)) { // Heal up to full HP but not over it (with limit of 8HP)
    let healing = Math.round(RNG(1, (Player.attributes.totalHP - Player.attributes.currentHP)));
    Player.attributes.currentHP += healing;
    Output.addElement({
      "entity": "",
      "content": "You sit and rest for a while, regaining " + healing + "HP."
    });
    DisplayInventory(Player);
  } else { // Heal up to 8HP
    let healing = Math.round(RNG((0.01 * Player.attributes.totalHP), (0.08 * Player.attributes.totalHP)));
    Player.attributes.currentHP += healing;
    Output.addElement({
      "entity": "",
      "content": "You sit and rest for a while, regaining " + healing + "HP."
    });
    DisplayInventory(Player);
  }
  Player.hasRested = true;
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