const MovePlayer = require("./MovePlayer.js");
const PlayerPosition = require("./PlayerPosition.js");
const Output = require("../Output.js");
const Look = require("./Look.js");


function Parse (input, Player, CurrentMap) {

  var playerPos = PlayerPosition(CurrentMap);

  var command = input.toLower().split(" ");
  if (command.length === 1) {
    switch (command[0]) {
      case "move":
        Output.addElement({
          "entity": "Error:",
          "content": "Move where?"
        });
          // Output "Error: Move where?"
        break;
      case "walk":
        Output.addElement({
          "entity": "Error:",
          "content": "Walk where?"
        });
          // Output "Error: Walk where?"
        break;
      case "travel":
        Output.addElement({
          "entity": "Error:",
          "content": "Travel where?"
        });
          // Output "Error: Travel where?"
        break;
      case "go":
        Output.addElement({
          "entity": "Error:",
          "content": "Go where?"
        });
          // Output "Error: Go where?"
        break;
      case "north":
          MovePlayer(CurrentMap, "north"),
        break;
      case "south":
          MovePlayer(CurrentMap, "south");

        break;
      case "east":
          MovePlayer(CurrentMap, "east");
        break;
      case "west":
          MovePlayer(CurrentMap, "west");
        break;
      case "fight":
        if (CurrentMap[playerPos].creature) {
          // Emit "fight" with Player, CurrentMap, Creature args
          // Not sure if this will work:
          GS_Main.emit("fight", {
            player: Player,
            map: CurrentMap,
            creature: CurrentMap[playerPos].creature
          });
        } else {
          Output.addElement({
            "entity": "Error:",
            "content": "There's nothing here to fight!"
          });
        }
        break;
      case "shop":
          // Emit "enterShop" with Player, CurrentMap args
          // Not sure if this will work:
          GS_Main.emit("enterShop", {
            player: Player,
            map: CurrentMap
          });
        break;
      case "look":
        Look(CurrentMap);
        break;
      default:
        Output.addElement({
          "entity": "Error:",
          "content": "Unknown command. Try [look]ing around or [go]ing in a direction."
        });
    }
  } else if (command.length === 2) {
    switch (command[0]) {
      case "move":
        command[0] = "movement"
        break;
      case "walk":
        command[0] = "movement"
        break;
      case "travel":
        command[0] = "movement"
        break;
      case "go":
        command[0] = "movement"
        break;
      default:
        // do nothing
    }
    switch (command[0]) {
      case "movement":
        MovePlayer(CurrentMap, command[1]);
        break;
      case "fight":
        if (CurrentMap[playerPos].creature) {
          GS_Main.emit("fight", {
            player: Player,
            map: CurrentMap,
            creature: CurrentMap[playerPos].creature
          });
        } else {
          Output.addElement({
            "entity": "",
            "content": "There's nothing here to fight!"
          });
        }
      default:

    }
  }
}

module.exports = Parse;
