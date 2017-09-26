"use strict"
const RNG = require("./utils/RNG.js");
const newCreature = require("./Creature.js");
const CreatureDb = require("../db/Creatures.json");

function genMap(sideLength, edge) {
  var mapSize = sideLength * sideLength;
  var map = [];

  for (let i = 0; i < mapSize; i++) {
    map[i] = {
      "playerIsHere": false,
      "creature": [],
      "items": [],
      "structures": [],
      "terrain": [],
      "playerHasSeen": false
    };
  }

  // Generate terrain first

  // RIVERS - only spawn 60% of the time
  if (RNG() < 0.6) {

    // Bridge appears first
    var bridgeMain = Math.round(RNG(mapSize-1));
    var bridgePlaced = false;
    while (!bridgePlaced) {
      if (bridgeMain % sideLength === 0 || (bridgeMain + 1) % sideLength === 0) {
        bridgeMain = Math.round(RNG(mapSize-1));
      } else {
        map[bridgeMain].terrain = "bridge";
        bridgePlaced = true;
      }
    }
    // Add | | above bridge if not at the top of map
    if (bridgeMain - sideLength > 0) {
      var bridgeUpper = bridgeMain - sideLength;
      map[bridgeUpper].terrain = "bridgeUpper";
    }
    // Add | | below bridge if not at bottom of map
    if (bridgeMain + sideLength < (mapSize - 1)) {
      var bridgeLower = bridgeMain + sideLength;
      map[bridgeLower].terrain = "bridgeLower";
    }

    // River extends upwards from bridge
    var riverAtTop = false;
    while (!riverAtTop) {
      // Is the bridge or bridge upper at the top of the map?
      if (bridgeMain - (sideLength * 2) < 0) {
        riverAtTop = true;
      } else { // Extend the river upwards
        var lastRiverTile = bridgeUpper;
        while (lastRiverTile - sideLength > 0) {
          let riverTile = Math.round(RNG((lastRiverTile - sideLength - 1), (lastRiverTile - sideLength + 1)));
          map[riverTile].terrain = "river";
          lastRiverTile = riverTile;
        }
        riverAtTop = true;
      }
    }

    // River extends downwards from bridge
    var riverAtBottom = false;
    while (!riverAtBottom) {
      // Is the bridge or bridge lower at the bottom of the map?
      if (bridgeMain + (sideLength * 2) > (map.length - 1)) {
        riverAtBottom = true;
      } else { // Extend the river downwards
        var lastRiverTile = bridgeLower;
        while (lastRiverTile + sideLength < (map.length - 1)) {
          let riverTile = Math.round(RNG((lastRiverTile + sideLength - 1), (lastRiverTile + sideLength + 1)));
          map[riverTile].terrain = "river";
          lastRiverTile = riverTile;
        }
        riverAtBottom = true;
      }
    }
  }

  // Generate up to one creature per empty tile
  for (let i=0; i < mapSize; i++) {
    // Check to see if the tile has a river
    if (map[i].terrain.length !== 0) {
      map[i].creature = null;
    } else {
      // Check to see if there is a creature on that tile, if not set to null
      var spawnedCreature = chooseCreature();
      if (spawnedCreature !== "none") {
        map[i].creature = newCreature(spawnedCreature);
      } else {
        map[i].creature = null;
      }
    }
  }

  function randomPosition(edge) {
    let position;
    switch (edge) {
      case "none":
        position = Math.round(RNG(mapSize-1));
        break;
      case "north":
        position = Math.round(RNG(sideLength-1));
        break;
      case "south":
        position = (mapSize - 1) - Math.round(RNG(sideLength-1));
        break;
      case "east":
        position = (Math.round(RNG(sideLength))*sideLength)-1;
        break;
      case "west":
        position = Math.round(RNG(sideLength-1))*sideLength;
        break;
    }
  
    return position;
  }

  // Place player on an empty tile based off edge argument
  var playerPos = randomPosition(edge);  
  var playerPlaced = false;
  while (!playerPlaced) {
    if (map[playerPos].terrain.length !== 0) {
      playerPos = randomPosition(edge);
    } else {
      map[playerPos].creature = null;
      map[playerPos].playerIsHere = true;
      map[playerPos].playerHasSeen = true;
      revealSurroundings(playerPos, sideLength, map);
      playerPlaced = true;
    }
  }

  return map;
}

module.exports = genMap;

function revealSurroundings (playerPos, sideLength, map) {
  var north = { "position":(playerPos - sideLength), "name":"North" };
  var south = { "position":(playerPos + sideLength), "name":"South" };
  var east  = { "position":(playerPos + 1), "name":"East" };
  var west  = { "position":(playerPos - 1), "name":"West" };

  if (playerPos % sideLength === 0) { // Player is at left hand side of map
    if (playerPos - sideLength < 0) { // Player is at top of map
      // Don't look North or West
      revealAdjacent(map, south, east);
    } else if (playerPos + sideLength >= map.length) { // Player is at bottom of map
      // Don't look South or West
      revealAdjacent(map, north, east);
    }  else {
      // Don't look West
      revealAdjacent(map, north, south, east);
    }
  } else if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
    if (playerPos - sideLength < 0) { // Player is at top of map
      // Don't look North or East
      revealAdjacent(map, south, west);
    } else if (playerPos + sideLength >= map.length) { // Player is at bottom of map
      // Don't look South or East
      revealAdjacent(map, north, west);
    }  else {
      // Don't look East
      revealAdjacent(map, north, south, west);
    }
  } else if (playerPos - sideLength < 0) { // Player is at top of map
    // Don't look North
    revealAdjacent(map, south, east, west);
  } else if (playerPos + sideLength >= map.length) { // Player is at bottom of map
    // Don't look South
    revealAdjacent(map, north, east, west);
  } else { // Player is not at an edge
    revealAdjacent(map, north, south, east, west);
  }
}

function revealAdjacent(map, ...args) {
  for (let direction of args) {
    map[direction.position].playerHasSeen = true;
  }
}

function chooseCreature() {
  var creatureSpawned;

  var spawnRoll = {};
  // Rough random picker based on each creatures spawn chance
  for (let key in CreatureDb) {
    spawnRoll[key] = RNG(CreatureDb[key].attributes.spawnChance)
  }
  // Add a final value for no creatures spawning
  spawnRoll["none"] = RNG(3);
  for (let key in spawnRoll) {
    if (!creatureSpawned || spawnRoll[key] > spawnRoll[creatureSpawned]) {
      creatureSpawned = key;
    }
  }
  return creatureSpawned;

}