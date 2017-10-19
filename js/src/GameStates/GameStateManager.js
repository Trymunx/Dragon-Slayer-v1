const EventEmitter = require("events");
const fs = require("fs");//For walking the GameStates dir
const path = require("path");
const GameState = require("./GameState.js");

class GameStateManager extends EventEmitter {
    constructor() {
        super();
        this.loading = [];//null;
    }
    loadGameStates (walkDir, recurse) {
        if (!walkDir) {
            walkDir = path.relative(process.cwd(), __dirname);
        }
        var manager = this;
        console.debug("Loading GameStates from %s", walkDir);
        var p = new Promise(function (resolve, reject) {
            fs.readdir(walkDir, function (err, files) {
                Promise.all(files.map((file) => loadFile(manager, walkDir, file, recurse))).then(resolve);
            });
        });
        p.then(() => this.loading = null);
        this.loading.push(p);
        return p;
    }
    register(gamestate)
    {
        var activateGameState = function (data) {
            gamestate.runState(this, data);
        }.bind(this);

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
    startGame () {
        Promise.all(this.loading).then(() => {
            console.debug("Starting game");
            this.emit("start");
        });
    }
}

function loadFile (manager, directory, name, recurse) {
    return new Promise(function (resolve) {
        var filePath = path.join(directory, name);
        fs.stat(filePath, function (error, stat) {
            if (error) {
                console.error("Error stating file.", error);
                resolve();
            } else if(recurse && stat.isDirectory()) {
                manager.loadGameStates(filePath, recurse);//.then(resolve());
            } else if (stat.isFile() && /^GS_.+\.js$/.test(name)) {
                let reqPath = "./" + path.relative(__dirname,filePath);
                let gamestate = require(path.join(process.cwd(), filePath));
                if (!(gamestate instanceof GameState))
                {
                    console.warn("Skipping loading %s due to it not being an instance of GameState.", filePath);
                }
                else {
                    if (!gamestate.name)
                    {
                        gamestate.name = path.basename(filePath, ".js");//.replace(/^(?:.+\/)?GS_(.+)\.js$/, "$1");
                    }
                    console.debug("Loading game state from file \"%s\" as \"%s\".", filePath, gamestate.name);
                    manager.register(gamestate);
                }
            }
            resolve();
        });
    });
}

module.exports = GameStateManager;