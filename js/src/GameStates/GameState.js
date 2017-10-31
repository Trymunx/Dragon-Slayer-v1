class GameState {
    constructor (...handledEvents) {
        this.handledEvents = handledEvents != undefined ? handledEvents : [];
        this.player = null;
    }
    setPlayer (player) {
        this.player = player;
    }
    /*runState (gameStateManager, ...args) {
    }*/
}

module.exports = GameState;