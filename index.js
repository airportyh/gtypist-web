var GTypistWeb = require('./gtypist_web')
var barber = require('barber')

window.onload = main
function main(){
  barber.install()
  var ui = GTypistWeb()
  document.body.appendChild(ui.element)
}
