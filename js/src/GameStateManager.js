const StartGame = require("./GameStates/GS_StartGame.js");
const GenerateMap = require("./GameStates/GS_GenerateMap.js");
const Main = require("./GameStates/GS_Main.js");
const Fight = require("./GameStates/GS_Fight.js");
const Shop = require("./GameStates/GS_Shop.js");
const EndGame = require("./GameStates/GS_EndGame.js");

const GameStates = [
  StartGame,
  GenerateMap,
  Main,
  Fight,
  Shop,
  EndGame
];

var currentState = null;
