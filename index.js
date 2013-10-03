var GTypistWeb = require('./gtypist_web')

window.onload = main
function main(){
  var ui = GTypistWeb()
  document.body.appendChild(ui.element)
}
