const Chunk = require("./Chunk.js");

class Tile {
  constructor(/*x, y, chunk*/) {
    // this.relx = x; // x relative to chunk
    // this.rely = y; // y relative to chunk
    // this.chunk = chunk;
    // this.playerHere = false;
    this.playerHasSeen = true; // TODO: Make false to enable discovery fog
    this.creatures = [];
    this.items = [];
    // this.structures = [];
    this.terrain = "none"; // No terrain features, eg. rivers or hills
    this.display;
    // this.generators = [];
    this.spawnRateModifiers = new Map();
  }

  setSpawnRateMod (creature, spawnrate) {
    this.spawnRateModifiers.set(creature, spawnrate);
  }
  
  getSpawnRateMod (creature) {
    return this.spawnRateModifiers.has(creature) ? this.spawnRateModifiers.get(creature) : 1;
  }

}

module.exports = Tile;

