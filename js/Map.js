"use strict"
const drawMap = require("./src/DrawMap.js");
const genMap = require("./src/GenerateMap.js");
const RNG = require("./src/utils/RNG.js");

var map = genMap(Math.round(RNG(5,20)));
drawMap(map);
// console.log(drawMap(map));
