class GameData {
    constructor () {
        this.player = null;
        this.currentMap = null;
    }
    getPlayerTile () {
        return this.player != null && this.currentMap != null ?
            this.currentMap[this.player.position] : null;
    }
};
var data = new GameData();

module.exports = data;