const MovePlayer = require("../MovePlayer.js");
const EventEmitter = require("events").EventEmitter;
const Input_Text = document.getElementById("input-text");
const Output = require("../../Output.js");
const DrawMap = require("../DrawMap.js");
const PlayerPosition = require("../PlayerPosition.js");
const Look = require("../Look.js");
const DisplayInventory = require("../DisplayInventory.js");
const RNG = require("../utils/RNG.js");
// const Parse = require("../Parse.js");

var GS_Main = {};
var Player;
var CurrentMap;
var GameStateManager;

var commands = [
  "ATTACK",
  "FIGHT",
  "MOVE",
  "WALK",
  "GO",
  "NORTH",
  "SOUTH",
  "EAST",
  "WEST",
  "LOOK",
  "NEW MAP",
  "REST",
  "POTION",
  "DRINK POTION"
];

var directions = [
  "AROUND",
  "NORTH",
  "SOUTH",
  "EAST",
  "WEST"
]

GS_Main.setPlayer = function (player) {
    Player = player;
}

GS_Main.setMap = function (map) {
    CurrentMap = map;
}

GS_Main.includeGSManager = function (gsManager) {
  GameStateManager = gsManager;
}

// Receive command
function getInputAndParse (e) {
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

      playerPos = PlayerPosition(CurrentMap);
      var command = text.toUpperCase().split(" ");

      commandParse(command, 0)
      // Input_Text.removeEventListener("keydown", getInputAndParse);
    }

    Input_Text.value = "";
    // tabCompletion.enteredText = "";
    // tabCompletion.currentIndex = 0;

  } else if (e.keyCode === 37) { // Left arrow key
    e.preventDefault();
    commandParse(["WEST"], 0);
  } else if (e.keyCode === 38) { // Up arrow key
    e.preventDefault();
    commandParse(["NORTH"], 0);
  } else if (e.keyCode === 39) { // Right arrow key
    e.preventDefault();
    commandParse(["EAST"], 0);
  } else if (e.keyCode === 40) { // Down arrow key
    e.preventDefault();
    commandParse(["SOUTH"], 0);
  // } else if (e.keyCode === 9) {
  //   let text = Input_Text.value;
  //   if (text === "") {
  //     validCompletions = commands.slice();
  //   } else {
  //     if (validCompletions.length === 0) {
  //       var command = text.toUpperCase().split("");
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

GS_Main.runState = function () {


  // Initialise above function
  Input_Text.addEventListener("keydown", getInputAndParse);
  


}

module.exports = GS_Main;


function commandParse(input, index) {
  switch (input[index]) {
    case "ATTACK":
    case "FIGHT":
      if (CurrentMap[playerPos].creature) {
        Input_Text.removeEventListener("keydown", getInputAndParse);
        playerPos = PlayerPosition(CurrentMap);
        Output.addElement({
          "entity": "",
          "content": "You are now fighting the " + CurrentMap[playerPos].creature.name + "."
        });
        GameStateManager.emit("fight", {
          player: Player,
          map: CurrentMap,
          creature: CurrentMap[playerPos].creature
        });

      } else {
        Output.addElement({
          "entity": "Error:",
          "content": "There's nothing here to attack!"
        });
      }
      break;
    case "WALK":
    case "MOVE":
    case "GO":
      commandParse(input, 1);
      break;
    case "NORTH":
      MovePlayer(CurrentMap, "north");
      playerPos = PlayerPosition(CurrentMap);
      if (CurrentMap[playerPos].creature && CurrentMap[playerPos].creature.attributes.aggressive) {
        // Aggressive creatures attack on sight
        Input_Text.removeEventListener("keydown", getInputAndParse);
        Output.addElement({
          "entity": "",
          "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
        });
        GameStateManager.emit("fight", {
          player: Player,
          map: CurrentMap,
          creature: CurrentMap[playerPos].creature
        });
      }
      break;
    case "SOUTH":
      MovePlayer(CurrentMap, "south");
      playerPos = PlayerPosition(CurrentMap);
      if (CurrentMap[playerPos].creature && CurrentMap[playerPos].creature.attributes.aggressive) {
        // Aggressive creatures attack on sight
        Input_Text.removeEventListener("keydown", getInputAndParse);
        Output.addElement({
          "entity": "",
          "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
        });
        GameStateManager.emit("fight", {
          player: Player,
          map: CurrentMap,
          creature: CurrentMap[playerPos].creature
        });
      }
      break;
    case "EAST":
      MovePlayer(CurrentMap, "east");
      playerPos = PlayerPosition(CurrentMap);
      if (CurrentMap[playerPos].creature && CurrentMap[playerPos].creature.attributes.aggressive) {
        // Aggressive creatures attack on sight
        Input_Text.removeEventListener("keydown", getInputAndParse);
        Output.addElement({
          "entity": "",
          "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
        });
        GameStateManager.emit("fight", {
          player: Player,
          map: CurrentMap,
          creature: CurrentMap[playerPos].creature
        });
      }
      break;
    case "WEST":
      MovePlayer(CurrentMap, "west");
      playerPos = PlayerPosition(CurrentMap);
      if (CurrentMap[playerPos].creature && CurrentMap[playerPos].creature.attributes.aggressive) {
        // Aggressive creatures attack on sight
        Input_Text.removeEventListener("keydown", getInputAndParse);
        Output.addElement({
          "entity": "",
          "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
        });
        GameStateManager.emit("fight", {
          player: Player,
          map: CurrentMap,
          creature: CurrentMap[playerPos].creature
        });
      }
      break;
    case "LOOK":
      if (directions.includes(input[1])) {
        Look(CurrentMap, input[1]);
        DrawMap(CurrentMap);
      } else if (input[1] === "AT") {
        commandParse(["LOOK", input[2]], 0);
      } else {
        Output.addElement({
          "entity": "",
          "content": "Look at what? Try a direction, or \"LOOK AROUND\" for the surroundings."
        });
        
      }
      break;
    case "POTION":
      drinkPotion();
      break;
    case "DRINK":
      if (input[1] === "POTION") {
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
    case "REST":
      rest();
      break;
    case "RESTART":
      Input_Text.removeEventListener("keydown", getInputAndParse);
      GameStateManager.emit("start");
      break;
    case "?":
    case "HELP":
      Output.addElement({
        "entity": "Help:",
        "content": "To move, enter compass directions or use the arrow keys. Enter [ ATTACK ] to fight a creature, [ LOOK ] to see what's around you and [ NEW MAP ] to spawn in a new map."
      });
      break;
    case "NEW":
      if (input[1] === "MAP") {
        GameStateManager.emit("playerCreated", {
          player: Player
        });
      } else {
        Output.addElement({
          "entity": "Error:",
          "content": "I don't know what a new " + input[1].toLowerCase() + " is!"
        });
      }
      break;
    default:
      Output.addElement({
        "entity": "Error:",
        "content": "Unknown command, type \"help\" or \"?\" for help."
      });
  }
}

function drinkPotion() {
  if (Player.attributes.currentHP >= Player.attributes.totalHP) {
    Output.addElement({
      "entity": "",
      "content": "You already have full health!"
    });
  } else {
    if (Player.inventory.potions > 0) {
      let healing = (Math.min(50, Player.attributes.totalHP - Player.attributes.currentHP));
      Player.attributes.currentHP += healing;
      Player.inventory.potions--;
      Output.addElement({
        "entity": "",
        "content": "You drink a potion, restoring " + healing + "HP. You have " + Player.inventory.potions + " potions remaining."
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
  } else if (Player.attributes.currentHP >= Player.attributes.totalHP - 8) { // Heal up to full HP but not over it (with limit of 8HP)
    let healing = Math.round(RNG(1, (100 - Player.attributes.currentHP)));
    Player.attributes.currentHP += healing;
    Output.addElement({
      "entity": "",
      "content": "You tend to your wounds as best you can, healing " + healing + "HP."
    });
    DisplayInventory(Player);
  } else { // Heal up to 8HP
    let healing = Math.round(RNG(1, 8));
    Player.attributes.currentHP += healing;
    Output.addElement({
      "entity": "",
      "content": "You tend to your wounds as best you can, healing " + healing + "HP."
    });
    DisplayInventory(Player);
  }
}


/*
  text = text.toUpperCase();

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
*/