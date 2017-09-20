const MovePlayer = require("../MovePlayer.js");
const EventEmitter = require("events").EventEmitter;
const Input_Text = document.getElementById("input-text");
const Output = require("../../Output.js");
const DrawMap = require("../DrawMap.js");
const PlayerPosition = require("../PlayerPosition.js");
const Look = require("../Look.js");
// const Parse = require("../Parse.js");


var GS_Main = {};
var Player;
var CurrentMap;
var GameStateManager;

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
      commandParse(input, 1);
      break;
    case "MOVE":
      commandParse(input, 1);
      break;
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
      Look(CurrentMap);
      break;
    case "RESTART":
      Input_Text.removeEventListener("keydown", getInputAndParse);
      GameStateManager.emit("start");
      break;
    default:
      Output.addElement({
        "entity": "Error:",
        "content": "At this time, you can only enter [NORTH / SOUTH / EAST / WEST / ATTACK / LOOK / RESTART]."
      });
  }
}