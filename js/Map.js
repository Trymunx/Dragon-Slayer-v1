"use strict"
const drawMap = require("./src/drawMap.js");
const genMap = require("./src/mapGen.js");
console.log(Input);
const RNG = require("./src/utils/RNG.js");

var map = genMap(Math.round(Math.random() * (20 - 5) + 5));
document.getElementById("map").innerHTML = drawMap(map);
// console.log(drawMap(map));
