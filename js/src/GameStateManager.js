const StartGame = require("./GameStates/GS_StartGame.js");
const GenerateMap = require("./GameStates/GS_GenerateMap.js");
const Main = require("./GameStates/GS_Main.js");
const Shop = require("./GameStates/GS_Shop.js");
const Fight = require("./GameStates/GS_Fight.js");
const EndGame = require("./GameStates/GS_EndGame.js");

const GameStates = [
  StartGame,
  GenerateMap,
  Main,
  Shop,
  Fight,
  EndGame
];

var currentState = null;

gameState.on("start", function () {
  currentState = StartGame;
});

gameState.on("spawn", function (data) {
  currentState = GenerateMap;
  "player": data.player;
});

gameState.on("generated", function (data) {
  currentState = Main;
  "player": data.player;
  "map": data.map;
});

gameState.on("fight", function (data) {
  currentState = Fight;
  "player": data.player;
  "creature": data.creature;
  "map": data.map;
});

gameState.on("enterShop", function (data) {
  currentState = Shop;
  "player": data.player;
  "map": data.map;
});

gameState.on("exitShop", function (data) {
  currentState = Main;
  "player": data.player;
  "map": data.map;
});

gameState.on("won", function (data) {
  currentState = Main;
  "player": data.player;
  "map": data.map;
});

gameState.on("slain", function (data) {
  currentState = EndGame;
  "player": data.player;
});
