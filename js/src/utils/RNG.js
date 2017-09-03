"use strict"
function RNG (...args) {
  let result = 0;

  // Check number of arguments is fewer than two
  if (args.length > 2) {
    console.log("Error[RNG]: Too many arguments. First two arguments used.");
  }
  // Just take first two arguments if more are supplied
  if (args[0] && args[1]) {
    result = Math.random() * (args[1] - args[0]) + args[0];
  } else if (args[0]) {
    result = Math.random() * args[0];
  } else {
    result = Math.random();
  }

  return result;
}

module.exports = RNG;
