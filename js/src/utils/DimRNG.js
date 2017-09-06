const RNG = require("./RNG.js");


function factorial(num) {
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function dimRNG(min, max, ...args) {
  var result;
  // range is the same as n in the binomial function, as it is the max - min
  var range = max - min;
  // mean is found by np, or for our values (range * probability) + min value where p=0.25 for a positive skew
  var mean;
  if (!args[0]) {
    mean = min + (range / 4);
  } else {
    mean = args[0];
  }

  // x is an array of integer values of x from the minimum value to the maximum value, inclusive
  var x = [];
  for (let i = min, j = 0; i <= max; i++) {
    x[j++] = i;
  }

  // y is an array of y values for each integer x between min and max, inclusive
  var y = [];
  for (let i = 0; i < x.length; i++) {
    // y is found using the binomial distribution formula
    //
    //        n!          (k)          (n-k)
    //     --------  *  p^    *  (1-p)^
    //     k!(n-k)!
    //
    //
    // x[i] represents k here
    var nMinusx = range - x[i]; // or n - k
    var nMinusxFactorial = factorial(nMinusx);
    var prob = mean / range;
    y[i] = factorial(range)/(factorial(x[i]) * nMinusxFactorial) * Math.pow(prob, x[i]) * Math.pow((1 - prob), nMinusx);
  }
  // yTimesRandom assigns each value of y a random value from 0 to y[i]
  var yTimesRandom = [];

  for (let i = 0; i <= range; i++) {
    // Multiplies y by a random number
    yTimesRandom[i] = Math.random() * Math.pow(y[i], (1/25));
  }
  // xAtMaxY is the value of x at which yTimesRandom is highest
  var xAtMaxY = 0;
  // highestYValue is the value of y when x = xAtMaxY
  var highestYValue = yTimesRandom[xAtMaxY];
  for (let i = 0; i < yTimesRandom.length; i++) {
    if (yTimesRandom[i] > highestYValue) {
      // If the value of y at this x is greater, change the xAtMaxY to this x value
      xAtMaxY = i;
      highestYValue = yTimesRandom[i];
    }
  }

  result = x[xAtMaxY];

  return result;
}

module.exports = dimRNG;
