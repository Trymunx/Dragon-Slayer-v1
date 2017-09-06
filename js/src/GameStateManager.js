const StartGame = require("./GameStates/GS_StartGame.js");
const GenerateMap = require("./GameStates/GS_GenerateMap.js");
const Main = require("./GameStates/GS_Main.js");
const Shop = require("./GameStates/GS_Shop.js");
const Fight = require("./GameStates/GS_Fight.js");
const EndGame = require("./GameStates/GS_EndGame.js");

var currentState;

function begin () {
  currentState = StartGame;
  currentState.runState();
  initEventHandlers();
}


function initEventHandlers () {
  currentState.on("start", function () {
    currentState = StartGame;
    currentState.runState();
  });

  currentState.on("playerCreated", function (data) {
    currentState = GenerateMap;
    currentState.setPlayer(data.player);
    currentState.runState();
  });

  currentState.on("generated", function (data) {
    currentState = Main;
    console.log("Main state set.");
    currentState.setPlayer(data.player);
    currentState.setMap(data.map);
    currentState.runState();
  });

  currentState.on("fight", function (data) {
    currentState = Fight;
    currentState.setPlayer(data.player);
    currentState.setCreature(data.creature);
    currentState.setMap(data.map);
  });

  currentState.on("enterShop", function (data) {
    currentState = Shop;
    currentState.setPlayer(data.player);
    currentState.setMap(data.map);
  });

  currentState.on("exitShop", function (data) {
    currentState = Main;
    currentState.setPlayer(data.player);
    currentState.setMap(data.map);
  });

  currentState.on("win", function (data) {
    currentState = Main;
    currentState.setPlayer(data.player);
    currentState.setMap(data.map);
  });

  currentState.on("slain", function (data) {
    currentState = EndGame;
    currentState.setPlayer(data.player);
  });
}

module.exports = begin;
