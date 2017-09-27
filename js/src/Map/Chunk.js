const parseDirection = require("../utils/Direction.js").parseDirection;
const chunkSize = 12;

class Chunk {
  constructor (x, y, map) {
    this.x = x;
    this.y = y;
    this.map = map;
    this.tiles = [[]];

    this.generate();
  }
  static chunkKey (x, y) {
    return toString(x + "," + y);
  }
  static get size () {
    return chunkSize;
  }
  getAdjChunk (direction) {
    let offset = parseDirection(direction);
    return this.map.getChunk(this.x + offset.x, this.y + offset.y);
  }
  getTile (position) {
    return this.tiles[position.x][position.y];
  }
  generate() {
    console.log("Generating: %O", this);
  }
}

module.exports = Chunk;

