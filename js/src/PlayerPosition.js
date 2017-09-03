function getPlayerPosition(map) {
  var position;
  for (let i = 0; i < map.length; i++) {
    if (map[i].playerIsHere) {
      position = i;
      break;
    }
  }
  return position;
}

module.exports = getPlayerPosition;
