function toBar(params) {
  let percent = params.value / params.totalValue;
  let barLength = Math.round(percent * params.totalLength);
  let emptyLength = params.totalLength - barLength;
  var bar = params.leftEnd;
  for (let i = 0; i < barLength; i++) {
    bar += params.char;
  }
  if (params.endChar) {
    bar += params.endChar;
  }
  for (let i = 0; i < emptyLength; i++) {
    bar += " ";
  }
  bar += params.rightEnd;

  return bar;
}

module.exports = toBar;