"use strict"
const RNG = require("./utils/RNG.js");
const NewCreature = require("./Creature.js");
const CreatureDb = require("../db/Creatures.json");
const creatures = Object.keys(CreatureDb);

function spawnCreature() {
  var creatureSpawned;

  var spawnRoll = [];
  // Rough random picker based on each creatures spawn chance
  for (let i in creatures) {
    // Multiplies their spawn chances by a random number
    spawnRoll[i] = RNG(CreatureDb[creatures[i]].attributes.spawnChance);
  }
  // Add a final value for no creatures spawning
  spawnRoll.push(RNG(3));

  // creatureIndex is the position in the creatures array
  var creatureIndex = 0;
  // indexValue is the value of that position in the spawnRoll array
  var indexValue = spawnRoll[creatureIndex];
  for (let i = 0; i < spawnRoll.length; i++) {
    if (spawnRoll[i] > indexValue) {
      // If the value of the next spawnRoll index is greater, change the creatureIndex to that creature
      creatureIndex = i;
      indexValue = spawnRoll[i];
    }
  }
  if (creatureIndex === creatures.length) {
    creatureSpawned = "none";
  } else {
    creatureSpawned = creatures[creatureIndex];
  }

  return creatureSpawned;
}

function genMap(sideLength) {
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
      var spawnedCreature = spawnCreature();
      if (spawnedCreature !== "none") {
        map[i].creature = NewCreature(spawnedCreature);
      } else {
        map[i].creature = null;
      }
    }
  }

  // Place player on an empty tile
  var randPos = Math.round(RNG(mapSize-1));
  var playerPlaced = false;
  while (!playerPlaced) {
    if (map[randPos].creature !== null || map[randPos].terrain.length !== 0) {
      randPos = Math.round(RNG(mapSize-1));
    } else {
      map[randPos].playerIsHere = true;
      map[randPos].playerHasSeen = true;
      playerPlaced = true;
    }
  }

  return map;
}

module.exports = genMap;
