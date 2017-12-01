const { Terrain } = require("./WorldGen.js");
const RNG = require("../utils/RNG.js");

class River extends Terrain {
  constructor(x, y) {
    super(x, y);
    this.riverTop = y-1;
    this.riverBottom = y;
  }

  generate(world) {
    let tile;
    let x;
    let firstX;
    let lastX;
    let SecLastX = this.originX;
    let chunk;

    chunk = world.getChunkFromTile(this.originX, this.riverTop);
    // Set the first tile, one above the starting tile
    firstX = x = lastX = Math.round(RNG(this.originX-1, this.originX+1));
    do {
      tile = chunk.getTileFromWorldCoords(x, this.riverTop);
      tile.terrain = "river";
      this.riverTop--;
      if (lastX === SecLastX) {
        x = Math.round(RNG(lastX-1, lastX+1));
      } else {
        x = Math.round(RNG(2*lastX-SecLastX, lastX));
      }
      SecLastX = lastX;
      lastX = x;
    } while (tile.relx >= 0);

    x = this.originX;
    lastX = this.originX;
    SecLastX = firstX;
    chunk = world.getChunkFromTile(this.originX, this.riverBottom);
    do {
      tile = chunk.getTileFromWorldCoords(this.originX, this.riverBottom);
      tile.terrain = "river";
      this.riverBottom++;
      if (lastX === SecLastX) {
        x = Math.round(RNG(lastX-1, lastX+1));
      } else {
        x = Math.round(RNG(2*lastX-SecLastX, lastX));
      }
      SecLastX = lastX;
      lastX = x;
    } while (tile.relx <= chunk.size); // Think this needs to be Chunk.size as size method is a static. Do I need to require Chunk for this?
  }
}

module.exports = River;

