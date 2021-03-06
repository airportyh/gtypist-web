var h = require('hyperscript')
var E = require('emmitt')

module.exports = TextView
function TextView(text){
  var view = {}
  var element = view.element = h('div',
    h('h2', text.title),
    h('p.text', text.text),
    h('a', {href: '#', onclick: function(e){
      e.preventDefault()
      E.emit(view, 'advance')
    }}, 'Next')
  )
  view.destroy = function(){}
  return view
}
