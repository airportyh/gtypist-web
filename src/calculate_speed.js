function calculateSpeed(chars, duration, errors){
  var cpm = chars / duration
  var adjustedCpm = (chars - errors * 5) / duration
  return {
      raw: cpm / 5,
      adjusted: adjustedCpm / 5
  }
}

module.exports = calculateSpeed