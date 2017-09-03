"use strict"

const EventEmitter = require("events");

const Output = require("./Output.js");

const Input_Text = document.getElementById("input-text");

var Input = new EventEmitter();

var playerName = "";

Input_Text.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    let text = Input_Text.value;

    if (text) {
      Input.emit("submit", {
        "entity": playerName,
        "content": text
      });
    }

    Input_Text.value = "";
  }
});

module.exports = Input;

Input.on("submit", function (data) {
  Output.addElement({
    "entity": data.entity,
    "content": data.content
  });
});

Input.getPlayer = function (player) {
  playerName = player.name;
};
