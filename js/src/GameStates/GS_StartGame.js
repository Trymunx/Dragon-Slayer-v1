const EventEmitter = require("events");
const Output = require("../../Output.js");
const NewPlayer = require('../NewPlayer.js');
const Splash = require("../splash/Splash.json");
const DisplayInventory = require("../DisplayInventory.js");
const Input_Text = document.getElementById("input-text");

var GS_StartGame = {};
var Player;
var Trymunx = Splash["Trymunx"];


GS_StartGame.runState = function (GameStateManager) {

  // Display welcome message
  Output.addElement({
    "entity": "",
    "content": "Greetings adventurer. Please enter your name to begin, or leave it blank to have a name chosen for you."
  });

  // Set map splash art
  document.getElementById("map").innerHTML = Trymunx;

  function enterName(e) {
    if (e.keyCode === 13) {
      e.preventDefault();

      let name = Input_Text.value;
      if (name) {
        Player = NewPlayer(name)
        Output.addElement({
          "entity": "Welcome,",
          "content": name
        });
      } else {
        Player = NewPlayer();
        Output.addElement({
          "entity": "Welcome,",
          "content": Player.name
        });
      }

      Input_Text.value = "";

      Input_Text.removeEventListener("keydown", enterName);

      DisplayInventory(Player);

      GameStateManager.emit("playerCreated", {
        player: Player
      });
    }
  }

  Input_Text.addEventListener("keydown", enterName);
}

module.exports = GS_StartGame;
