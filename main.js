var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on("ready", function () {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,

    minWidth: 800,
    minHeight: 500,
    acceptFirstMouse: true
  });

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
});
