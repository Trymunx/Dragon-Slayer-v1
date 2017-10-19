const EventEmitter = require("events");
const fs = require("fs");//For walking the GameStates dir
const path = require("path");
const GameState = require("./GameState.js");

class GameStateManager extends EventEmitter {
    constructor() {
        super();
        this.loadGameStates();
    }
    loadGameStates (walkDir, recurse) {
        if (!walkDir) {
            walkDir = __dirname;
        }
        var manager = this;
        console.debug("Loading GameStates from %s", walkDir);
        var p = new Promise(function (resolve, reject) {
            fs.readdir(walkDir, function (err, files) {
                Promise.all(files.map(function(file) {
                    // Make one pass and make the file complete
                    var filePath = path.join(walkDir, file);
                    return new Promise(function (resolve) {
                        fs.stat(filePath, function(error, stat) {
                            if (error) {
                                console.error("Error stating file.", error);
                                resolve();
                                return;
                            }
                            if (stat.isFile() && /^GS_.+\.js$/.test(file)) {
                                manager.register(require(filePath), file);
                                resolve();
                            }
                            else if(recurse && stat.isDirectory()) {
                                manager.loadGameStates(filePath, recurse).then(resolve());
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                })).then(resolve);
            });
        });
        if (!this.loading) {
            this.loading = p;
            this.loading.then(function() { this.loading = null;}.bind(this));
        }
        return p;
    }
    register(gamestate, fileName)
    {
        if (!(gamestate instanceof GameState))
        {
            console.warn("Skipping loading %s due to it not being an instance of GameState.", fileName);
        }
        else {
            let name = fileName.replace(/^GS_(.+)\.js$/, "$1");
            var activateGameState = function (data) {
                gamestate.runState(this, data);
            }.bind(this);
            if (!gamestate.name)
            {
                gamestate.name = name;
            }
            console.debug("Loading game state \"%s\".", gamestate.name);

            for (let handler of gamestate.handledEvents)
            {
                let runArgs = [this];
                if(typeof(handler) == "string")
                {
                    console.debug("Registering game state \"%s\" as a handler for \"%s\".", gamestate.name, handler);
                    this.on(handler, activateGameState);
                }
                else {
                    let key =  handler.event;
                    let val = handler.callback || handler.args;
                    console.debug("Registering game state \"%s\" as a handler for \"%s\" with arguments %O.", gamestate.name, key, val);
                    if (typeof(val) == "function")
                    {
                        this.on(key, val);
                    }
                    else {
                        this.on(key, function (data) {
                            gamestate.runState.apply(this, runArgs.concat(val, data));
                        }.bind(this));
                    }
                }
            }
        }
    }
    begin () {
        this.loading.then(function(){this.emit("start")}.bind(this));
    }
}

module.exports = GameStateManager;