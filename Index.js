// const Input = require("./js/Input.js");
// const Output = require("./js/Output.js");
// const Map = require("./js/Map.js");


// Run Game immediately
/*const begin = require("./js/src/GameStateManager.js");

begin();*/

const GameStateManager = require("./js/src/GameStates/GameStateManager.js");
var gsm = new GameStateManager();
//Autoload all: gsm.loadGameStates();

gsm.register(require("./js/src/GameStates/GS_StartGame.js"));
gsm.register(require("./js/src/GameStates/GS_GenerateMap.js"));
gsm.register(require("./js/src/GameStates/GS_OffPath.js"));
gsm.register(require("./js/src/GameStates/GS_Fight.js"));
gsm.register(require("./js/src/GameStates/GS_Path.js"));
gsm.register(require("./js/src/GameStates/GS_Shop.js"));
gsm.register(require("./js/src/GameStates/GS_EndGame.js"));

gsm.startGame();