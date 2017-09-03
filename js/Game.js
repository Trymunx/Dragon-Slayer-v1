const Output = require("./Output.js");
const Input = require("./Input.js");
const newPlayer = require("./src/newPlayer.js");

document.onLoad = (function() {
  Output.addElement({
    "entity": "Welcome",
    "content": "Please enter your name to begin your adventure, or leave it blank to have a name chosen for you."
  });
})();

Input.
var player = newPlayer(name);
Input.getPlayer(player);
