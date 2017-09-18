const StartGame = require("./GameStates/GS_StartGame.js");
const GenerateMap = require("./GameStates/GS_GenerateMap.js");
const Main = require("./GameStates/GS_Main.js");
const Shop = require("./GameStates/GS_Shop.js");
const Fight = require("./GameStates/GS_Fight.js");
const EndGame = require("./GameStates/GS_EndGame.js");
const EventEmitter = require("events");

var GameStateManager = new EventEmitter();

function begin () {
  StartGame.runState(GameStateManager);
  initEventHandlers();
}


function initEventHandlers () {
  GameStateManager.on("start", function () {
    StartGame.runState(GameStateManager);
  });

  GameStateManager.on("playerCreated", function (data) {
    GenerateMap.setPlayer(data.player);
    GenerateMap.runState(GameStateManager);
  });

  GameStateManager.on("generated", function (data) {
    Main.setPlayer(data.player);
    Main.setMap(data.map);
    Main.includeGSManager(GameStateManager);
    Main.runState(GameStateManager);
  });

  GameStateManager.on("fight", function (data) {
    Fight.setPlayer(data.player);
    Fight.setCreature(data.creature);
    Fight.setMap(data.map);
    Fight.runState(GameStateManager);
  });

  GameStateManager.on("enterShop", function (data) {
    Shop.setPlayer(data.player);
    Shop.setMap(data.map);
  });

  GameStateManager.on("exitShop", function (data) {
    Main.setPlayer(data.player);
    Main.setMap(data.map);
    Main.includeGSManager(GameStateManager);
    Main.runState(GameStateManager);
  });

  GameStateManager.on("win", function (data) {
    Main.setPlayer(data.player);
    Main.setMap(data.map);
    Main.includeGSManager(GameStateManager);
    Main.runState(GameStateManager);
  });

  GameStateManager.on("run", function (data) {
    Main.setPlayer(data.player);
    Main.setMap(data.map);
    Main.includeGSManager(GameStateManager);
    Main.runState(GameStateManager);
  });

  GameStateManager.on("slain", function (data) {
    EndGame.setPlayer(data.player);
  });
}

module.exports = begin;
