const GameState = require("./GameState.js");
const GameData = require("../GameData.js");
const Output = require("../../Output.js");
const CreatureDb = require("../../db/Creatures.json");
// const Input_Text = document.getElementById("input-text");

var GS_EndGame = new GameState("slain");


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
      if (GameData.player.creaturesSlain.byType.dragon !== 0) {
        if (GameData.player.creaturesSlain.byType.dragon === 1) {
          Output.addElement({
            "entity": "",
            "content": "You slayed a dragon."
          });
        } else if (GameData.player.creaturesSlain.byType.dragon < 5) {
          Output.addElement({
            "entity": "",
            "content": "You are a mighty warrior, you slayed " + GameData.player.creaturesSlain.byType.dragon + " dragons!"
          });
        } else { // dragonsSlain > 5
          Output.addElement({
            "entity": "",
            "content": "Congratulations, you are a champion. You slayed " + GameData.player.creaturesSlain.byType.dragon + " dragons!"
          });
        }
      }
      // Check for other creatures slain
      if (GameData.player.creaturesSlain.slainNonDragon) {
        var creaturesSlainOutput = [];
        for (let key in GameData.player.creaturesSlain.byType) {
          if (GameData.player.creaturesSlain.byType[key]) {
            creaturesSlainOutput.push(GameData.player.creaturesSlain.byType[key] + " " + 
              (GameData.player.creaturesSlain.byType[key] === 1 ? CreatureDb[key].name : CreatureDb[key].namePlural));
          }
        }
        var goldAmount = GameData.player.inventory.getItem("gold") !== undefined ? GameData.player.inventory.getItem("gold").quantity : "absolutely no";
        Output.addElement({
          "entity": "",
          "content": "You slayed " + creaturesSlainOutput.join(", ") + " and earned " + goldAmount + " gold."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "You failed to slay a single creature."
        });
      }
  }
  