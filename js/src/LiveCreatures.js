function getLiveCreatures(map) {
  var creatures = {
    "aggresive": 0,
    "passive": 0
  };

  for (let i = 0; i < map.length; i++) {
    if (map[i].creature.attributes.aggresive = true) {
      creatures.aggresive += 1;
    } else if (map[i].creature.attributes.aggresive = false) {
      creatures.passive += 1;
    }
  }
  return creatures;
}

module.exports = getLiveCreatures;
