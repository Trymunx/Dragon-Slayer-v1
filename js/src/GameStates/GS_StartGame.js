const GameState = require("./GameState.js");
const GameData = require("../GameData.js");
const EventEmitter = require("events");
const Output = require("../../Output.js");
const NewPlayer = require('../NewPlayer.js');
const Splash = require("../splash/Splash.json");
const DisplayInventory = require("../DisplayInventory.js");
const Input_Text = document.getElementById("input-text");

var GS_StartGame = new GameState("start");
var Trymunx = Splash["TrymunxLarge"];


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
        GameData.player = NewPlayer(name)
        Output.addElement({
          "entity": "Welcome,",
          "content": name + "."
        });
      } else {
        GameData.player = NewPlayer();
        Output.addElement({
          "entity": "Welcome,",
          "content": GameData.player.name + "."
        });
      }

      Output.addElement({
        "entity": "",
        "content": "To move, enter compass directions or use the arrow keys. Enter [ attack ] to fight a creature and [ look around ] to see what's around you."
      });
      

      Input_Text.value = "";

      Input_Text.removeEventListener("keydown", enterName);

      DisplayInventory(GameData.player);

      GameStateManager.emit("playerCreated");
    }
  }

  Input_Text.addEventListener("keydown", enterName);
}

module.exports = GS_StartGame;
