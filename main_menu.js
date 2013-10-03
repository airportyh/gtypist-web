var E = require('emmitt')
var h = require('hyperscript')

module.exports = MainMenu
function MainMenu(index){
  var view = {}
  var element = view.element = h('ul')
  var links = []
  for (var i = 0; i < index.length; i++){
    var link
    var item = h('li', 
      link = h('a', {
        href: index[i].url
      }, index[i].title)
    )
    links.push(link)
    E.on(link, 'click', onLinkClicked)
    element.appendChild(item)
  }

  function onLinkClicked(e){
    e.preventDefault()
    E.emit(view, 'goto', this.href)
  }

  view.destroy = function(){
    for (var i = 0; i < links.length; i++){
      E.off(links[i], 'click', onLinkClicked)
    }
  }

  return view
}