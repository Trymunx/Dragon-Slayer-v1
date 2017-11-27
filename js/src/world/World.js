const Chunk = require("./Chunk.js");
const RNG = require("../utils.RNG.js");

class World {
  constructor(type, size) {
    this.chunks = new Map();
    this.type = type; // Example types: dungeon, forest, dragon-lair
    if (size > 0) {
      this.size = size;
      // } else if (size) {
      //   this.size = -1;
    } else {
      this.size = 8; // Arbitrary limit for player spawn chunk
    }
    let spawnChunk = this.genChunk(Math.floor(RNG(size)), Math.floor(RNG(size)));
  }
  getChunk(chunkX, chunkY) {
    return this.chunks.get(Chunk.chunkKey(chunkX, chunkY));
  }
  chunkExists(chunkX, chunkY) {
    return this.chunks.has(Chunk.chunkKey(chunkX, chunkY));
  }
  genChunk(chunkX, chunkY) {
    let chunk = new Chunk(chunkX, chunkY, this);
    this.chunks.set(Chunk.chunkKey(chunkX, chunkY), chunk);
    return chunk;
  }
  getChunkFromTile(tile_x, tile_y) {
    return this.getChunk(Math.floor(tile_x / Chunk.size), Math.floor(tile_y / Chunk.size));
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



module.exports = World;

function randomPosition() {
  return {
    x: Math.floor(RNG(Chunk.size)),
    y: Math.floor(RNG(Chunk.size))
  }
}