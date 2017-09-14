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

GS_Main.setPlayer = function (player) {
    Player = player;
}

GS_Main.setMap = function (map) {
    CurrentMap = map;
}

GS_Main.runState = function (GameStateManager) {
  // Receive command
  // If movement, move the playerPos
  //    then update the map
  // if fight, fight creature on the spot
  //    (emit "fight" to enter fight state)
  // if look, look at tile
  // if shop, enter shop
  //    (emit "enterShop" to enter shop state)
  // if restart, start game again (emit "start")

  // Receive command
  Input_Text.addEventListener("keydown", function (e) {
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
        switch (command[0]) {
          case "ATTACK":
            if (CurrentMap[playerPos].creature) {
              // Emit "fight" with Player, CurrentMap, Creature args
              // Not sure if this will work:
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
          case "NORTH":
            MovePlayer(CurrentMap, "north");
            if (CurrentMap[playerPos].creature.attributes.aggressive) {
              Output.addElement({
                "entity": "",
                "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
              });
              // Aggressive creatures attack on sight
              GameStateManager.emit("fight", {
                player: Player,
                map: CurrentMap,
                creature: CurrentMap[playerPos].creature
              });
            }
            break;
          case "SOUTH":
            MovePlayer(CurrentMap, "south");
            if (CurrentMap[playerPos].creature.attributes.aggressive) {
              Output.addElement({
                "entity": "",
                "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
              });
              // Aggressive creatures attack on sight
              GameStateManager.emit("fight", {
                player: Player,
                map: CurrentMap,
                creature: CurrentMap[playerPos].creature
              });
            }
            break;
          case "EAST":
            MovePlayer(CurrentMap, "east");
            if (CurrentMap[playerPos].creature.attributes.aggressive) {
              Output.addElement({
                "entity": "",
                "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
              });
              // Aggressive creatures attack on sight
              GameStateManager.emit("fight", {
                player: Player,
                map: CurrentMap,
                creature: CurrentMap[playerPos].creature
              });
            }
            break;
          case "WEST":
            MovePlayer(CurrentMap, "west");
            if (CurrentMap[playerPos].creature.attributes.aggressive) {
              Output.addElement({
                "entity": "",
                "content": "The " + CurrentMap[playerPos].creature.name + " attacks you!"
              });
              // Aggressive creatures attack on sight
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
          GameStateManager.emit("start");
            break;
          default:
            Output.addElement({
              "entity": "Error:",
              "content": "At this time, you can only enter [NORTH / SOUTH / EAST / WEST / ATTACK / LOOK / RESTART]."
            });
        }
      }

      Input_Text.value = "";

    }
  });



}

module.exports = GS_Main;
