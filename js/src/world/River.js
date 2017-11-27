const { Terrain } = require("./WorldGen.js");

class River extends Terrain {
  constructor(x, y) {
    super(x, y);
    this.riverTop = y;
    this.riverBottom = y;
  }

  generate(world) {
    let tile;
    let chunk;

    chunk = world.getChunkFromTile(this.originX, this.riverTop);
    do {
      tile = chunk.getTileFromWorldCoords(this.originX, this.riverTop);
      tile.terrain = "river";
      this.riverTop--;
    } while (tile.relx >= 0);

    chunk = world.getChunkFromTile(this.originX, this.riverBottom);
    do {
      tile = chunk.getTileFromWorldCoords(this.originX, this.riverBottom);
      tile.terrain = "river";
      this.riverBottom++;
    } while (tile.relx <= chunk.size);
  }
}

module.exports = River;