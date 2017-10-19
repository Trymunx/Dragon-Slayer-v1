// const Input = require("./js/Input.js");
// const Output = require("./js/Output.js");
// const Map = require("./js/Map.js");


// Run Game immediately
/*const begin = require("./js/src/GameStateManager.js");

begin();*/

const GameStateManager = require("./js/src/GameStates/GameStateManager.js");
var gsm = new GameStateManager();
gsm.loadGameStates();
gsm.startGame();