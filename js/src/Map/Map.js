const Chunk = require("./Chunk.js");
const RNG = require("../utils.RNG.js");

class Map {
  constructor (type, size) {
    this.chunks = {};
    this.type = type;
    if (size) {
      this.size = size;
    } else {
      size = 8; // Arbitrary limit for player spawn chunk
    }
    let spawnChunk = this.genChunk(RNG(size), RNG(size));

  }
  getChunk(x, y) {
    return this.chunks[Chunk.chunkKey(x, y)];
  }
  chunkExists(x, y) {
    return Boolean(this.chunks[Chunk.chunkKey(x, y)]);
  }
  genChunk(x, y) {
    let chunk = new Chunk(x, y, this);
    this.chunks[Chunk.chunkKey(x, y)] = chunk;
    return chunk;
  }
  placePlayer(spawnChunk) {
    let playerPos = randomPosition();
    var playerPlaced = false;
    while (!playerPlaced) {
      let tile = spawnChunk.getTile(playerPos);
      if (tile.terrain.length !== 0) {
        playerPos = randomPosition();
      } else {
        tile.creature = null;
        tile.playerIsHere = true;
        // tile.playerHasSeen = true;
        // revealSurroundings(playerPos, map);
        playerPlaced = true;
        player.position = playerPos;
      }
    }
  }
}



module.exports = Map;

function randomPosition () {
  return {
    x: Math.round(RNG(Chunk.size)),
    y: Math.round(RNG(Chunk.size))
  }
}