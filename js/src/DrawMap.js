"use strict"
// const mapGen = require("./mapGen.js");

// Creates an ASCII version of the map
function drawMap (map) {
  // Work out side length
  var sideLength = Math.sqrt(map.length);

  // Add horizontal borders, top border padded with a leading space,
  //  bottom padded with leading and trailing pipe
  var horizLength = (3 * sideLength) + 8;
  // Vertical borders are (2 * sidelength) + 4
  var vertLength = (2 * sideLength) + 4;

  // Add array to hold each line of the drawn map
  var drawnMap = [];
  drawnMap.length = vertLength;

  // Top border begins with a space
  var topBorder = " ";
  for (let i = 0; i < horizLength; i++) {
    topBorder += "_";
  }
  drawnMap[0] = topBorder;

  // Blank lines are always spaces padded with pipes
  var blankLine = "{";
  for (let i = 0; i < horizLength; i++) {
    blankLine += " ";
  }
  blankLine += "}";

  // Second and third lines are always blank
  drawnMap[1] = blankLine;
  drawnMap[2] = blankLine

  // Bottom border is always underscores padded with pipes
  var bottomBorder = "{";
  for (let i = 0; i < horizLength; i++) {
    bottomBorder += "_";
  }
  bottomBorder += "}";
  drawnMap[(vertLength)] = bottomBorder;

  // Gets the central map content
  var mapContent = [];
  for (let i = 0; i < sideLength; i++) {
    mapContent[i] = "";
  }
  for (var i = 0; i < sideLength; i++) {
    for (let j = (i * sideLength); j < ((i + 1) * sideLength); j++) {
      if (map[j].terrain === "river") {
        if ((j + sideLength) < map.length) {
          if (map[(j+sideLength - 1)].terrain === "river") {
            mapContent[i] += "<span class='river'>/ /</span>";
          } else if (map[(j+sideLength)].terrain === "river") {
            mapContent[i] += "<span class='river'>| |</span>";
          } else {
            mapContent[i] += "<span class='river'>\\ \\</span>";
          }
        } else {
          if (map[(j-sideLength - 1)].terrain === "river") {
            mapContent[i] += "<span class='river'>/ /</span>";
          } else if (map[(j-sideLength)].terrain === "river") {
            mapContent[i] += "<span class='river'>| |</span>";
          } else {
            mapContent[i] += "<span class='river'>\\ \\</span>";
          }
        }
      } else if (map[j].playerIsHere) {
        mapContent[i] += "[*]";
      } else if (map[j].creature !== null) {
        mapContent[i] += " " + map[j].creature.attributes.healthBar + " ";
      } else if (map[j].terrain === "bridge") {
        mapContent[i] += "<span class='bridge'>III</span>";
      } else if (map[j].terrain === "bridgeUpper" || map[j].terrain === "bridgeLower") {
        mapContent[i] += "<span class='river'>| |</span>";
      } else {
        mapContent[i] += "<span class='empty-tile'> ↟ </span>"; // If ↟ causes problems when displaying, use · instead
      }
    }
  }

  // Each line should print a pipe, then three spaces, then creatures on
  //  each grid space with two spaces inbetween, then three spaces and a final
  //  pipe (e.g. |    s  o  x    |)
  for (let j = 3; j < vertLength - 1; j+=2) {
    drawnMap[j] = "{    " + mapContent[(((j-1)/2)-1)] + "    }";
  }
  for (let i = 4; i < vertLength; i+=2) {
    drawnMap[i] = blankLine;
  }
  let mapOutput = "";
  for (let i in drawnMap) {
    // console.log(drawnMap[i]);
    mapOutput += drawnMap[i] + "<br>";
  }


  document.getElementById("map").innerHTML = mapOutput;
}

module.exports = drawMap;