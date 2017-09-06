const Begin = require("./src/GameStateManager.js")

const EventEmitter = require('events');

var stateChange = new EventEmitter();

document.onLoad = (function() {
  Begin();

})();
