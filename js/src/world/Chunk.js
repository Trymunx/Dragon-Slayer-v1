const parseDirection = require("../utils/Direction.js").parseDirection;
const Tile = require("./Tile.js");
const chunkSize = 12;

class Chunk {
  constructor(x, y, map) {
    this.x = x;
    this.y = y;
    this.map = map;
    this.tiles = [];
    for (let i = 0; i < chunkSize; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < chunkSize; j++) {
        this.tiles[i][j] = new Tile(i, j, this);
      }
    }

    this.generate();
  }
  static chunkKey(x, y) {
    return toString(x + "," + y);
  }
  static get size() {
    return chunkSize;
  }
  getAdjChunk(direction) {
    let offset = parseDirection(direction);
    return this.map.getChunk(this.x + offset.x, this.y + offset.y);
  }
  getTile(x, y) {
    return this.tiles[x][y];
  }
  getTileFromWorldCoords(tile_x, tile_y) {
    return this.getTile(tile_x % Chunk.size, tile_y % Chunk.size);
  }
  generate() {
    console.log("Generating: %O", this);
    // Terrain -> structure -> creatures -> player

  }
}

module.exports = Chunk;

