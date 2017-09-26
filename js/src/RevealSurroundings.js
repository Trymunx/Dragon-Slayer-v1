function revealSurroundings (playerPos, map) {
  var sideLength = Math.sqrt(map.length);
  var north = { "position":(playerPos - sideLength), "name":"North" };
  var south = { "position":(playerPos + sideLength), "name":"South" };
  var east  = { "position":(playerPos + 1), "name":"East" };
  var west  = { "position":(playerPos - 1), "name":"West" };

  if (playerPos % sideLength === 0) { // Player is at left hand side of map
    if (playerPos - sideLength < 0) { // Player is at top of map
      // Don't look North or West
      revealAdjacent(map, south, east);
    } else if (playerPos + sideLength >= map.length) { // Player is at bottom of map
      // Don't look South or West
      revealAdjacent(map, north, east);
    }  else {
      // Don't look West
      revealAdjacent(map, north, south, east);
    }
  } else if ((playerPos + 1) % sideLength === 0) { // Player is at RHS of map
    if (playerPos - sideLength < 0) { // Player is at top of map
      // Don't look North or East
      revealAdjacent(map, south, west);
    } else if (playerPos + sideLength >= map.length) { // Player is at bottom of map
      // Don't look South or East
      revealAdjacent(map, north, west);
    }  else {
      // Don't look East
      revealAdjacent(map, north, south, west);
    }
  } else if (playerPos - sideLength < 0) { // Player is at top of map
    // Don't look North
    revealAdjacent(map, south, east, west);
  } else if (playerPos + sideLength >= map.length) { // Player is at bottom of map
    // Don't look South
    revealAdjacent(map, north, east, west);
  } else { // Player is not at an edge
    revealAdjacent(map, north, south, east, west);
  }
}

function revealAdjacent(map, ...args) {
  for (let direction of args) {
    map[direction.position].playerHasSeen = true;
  }
}

module.exports = revealSurroundings;