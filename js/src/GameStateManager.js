const StartGame = require("./GameStates/GS_StartGame.js");
const GenerateMap = require("./GameStates/GS_GenerateMap.js");
const Main = require("./GameStates/GS_OffPath.js");
const Shop = require("./GameStates/GS_Shop.js");
const Fight = require("./GameStates/GS_Fight.js");
const EndGame = require("./GameStates/GS_EndGame.js");
const EventEmitter = require("events");

var GameStateManager = new EventEmitter();

function begin () {
  initEventHandlers();
  StartGame.runState(GameStateManager);
}


function initEventHandlers () {
  GameStateManager.on("start", function () {
    StartGame.runState(GameStateManager);
  });

  GameStateManager.on("playerCreated", function (data) {
    GenerateMap.setPlayer(data.player);
    GenerateMap.runState(GameStateManager, "none");
  });

  GameStateManager.on("atNorthEdge", function (data) {
    GenerateMap.setPlayer(data.player);
    GenerateMap.runState(GameStateManager, "south");
  });

  GameStateManager.on("atSouthEdge", function (data) {
    GenerateMap.setPlayer(data.player);
    GenerateMap.runState(GameStateManager, "north");
  });

  GameStateManager.on("atEastEdge", function (data) {
    GenerateMap.setPlayer(data.player);
    GenerateMap.runState(GameStateManager, "west");
  });

  GameStateManager.on("atWestEdge", function (data) {
    GenerateMap.setPlayer(data.player);
    GenerateMap.runState(GameStateManager, "east");
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
    Fight.runState(GameStateManager, data.aggressor);
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
    EndGame.runState(GameStateManager);
  });
}

module.exports = begin;
