module.exports = charCount
function charCount(page){
  var count = 0
  for (var i = 0; i < page.lines.length; i++){
    count += page.lines[i].length
  }
  return count
}