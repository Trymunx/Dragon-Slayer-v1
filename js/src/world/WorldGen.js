class WorldGeneration {
  /** Coords set relative to world, not to chunk */
  constructor(x, y) {
    this.originX = x;
    this.originY = y;
    this.genType = "unknown";
  }
  generate(world) {

  }
}

class Terrain extends WorldGeneration {
  constructor(x, y) {
    super(x, y);
    this.genType = "terrain";
  }
  generate(world) {

  }
}

class Structure extends WorldGeneration {
  constructor(x, y) {
    super(x, y);
    this.genType = "structure";
  }
  generate(world) {

  }
}

module.exports = {
  WorldGeneration: WorldGeneration,
  Terrain: Terrain,
  Structure: Structure
};