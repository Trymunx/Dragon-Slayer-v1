const Output = require("../../Output.js");
// const Input_Text = document.getElementById("input-text");

var GS_EndGame = {};
var Player;

GS_EndGame.setPlayer = function (player) {
  Player = player;
}

GS_EndGame.runState = function (GameStateManager) {
  Output.addElement({
    "entity": "",
    "content": "\n\n"
  });
  endGameReport();
}

module.exports = GS_EndGame;


function endGameReport() {
  
      //Check for dragons slain
      if (Player.creaturesSlain.byType.dragon.totalSlain !== 0) {
        if (Player.creaturesSlain.byType.dragon.totalSlain === 1) {
          Output.addElement({
            "entity": "",
            "content": "You slayed a dragon."
          });
        } else if (Player.creaturesSlain.byType.dragon.totalSlain < 5) {
          Output.addElement({
            "entity": "",
            "content": "You are a mighty warrior, you slayed " + Player.creaturesSlain.byType.dragon.totalSlain + " dragons!"
          });
        } else { // dragonsSlain > 5
          Output.addElement({
            "entity": "",
            "content": "Congratulations, you are a champion. You slayed " + Player.creaturesSlain.byType.dragon.totalSlain + " dragons!"
          });
        }
      }
      // Check for other creatures slain
      if (player.creaturesSlain.slainNonDragon) {
        var creaturesSlainOutput = [];
        for (let i = 0; i < player.creaturesSlain.byType.length; i++) {
          creaturesSlainOutput += " " + player.creaturesSlain.byType[i].totalSlain + " ";
          if (player.creaturesSlain.byType[i].totalSlain === 1) {
            creaturesSlainOutput += Object.keys(player.creaturesSlain.byType[i]);
          } else {
            creaturesSlainOutput += player.creaturesSlain.byType[i].namePlural;
          }
        }
        Output.addElement({
          "entity": "",
          "content": "You slayed" + creaturesSlainOutput + " and earned " + player.inventory.gold + " gold."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "You failed to slay a single creature."
        });
      }
  }
  