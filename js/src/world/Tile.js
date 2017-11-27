const Chunk = require("./Chunk.js");

class Tile {
  constructor(x, y, chunk) {
    this.relx = x; // x relative to chunk
    this.rely = y; // y relative to chunk
    this.chunk = chunk;
    this.playerHere = false;
    this.playerHasSeen = true; // TODO: Make false to enable discovery fog
    this.creatures = [];
    this.items = [];
    // this.structures = [];
    this.terrain = "none";
    this.generators = [];
  }
  get mapX() {
    return this.chunk.x * Chunk.size + this.relx;
  }
  get mapY() {
    return this.chunk.y * Chunk.size + this.rely;
  }

}

module.exports = Tile;