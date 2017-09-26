var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on("ready", function () {

  mainWindow = new BrowserWindow({
    width: 1250,
    height: 800,

    minWidth: 1200,
    minHeight: 640,
    acceptFirstMouse: true
  });

  mainWindow.setMenu(null);

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
});
