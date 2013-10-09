var E = require('emmitt')
var h = require('hyperscript')

module.exports = MainMenu
function MainMenu(index){
  var lessons = index.lessons
  var view = {}
  var element = view.element = h('ul')
  var links = []
  for (var i = 0; i < lessons.length; i++){
    var lesson = lessons[i]
    var link
    var item = h('li', 
      link = h('a', {
        href: '/' + lesson.name + '.html'
      }, lesson.title)
    )
    links.push(link)
    E.on(link, 'click', onLinkClicked)
    element.appendChild(item)
  }

  function fixup(path){
    return path.charAt(0) === '/' ? path : '/' + path
  }

  function onLinkClicked(e){
    e.preventDefault()
    E.emit(view, 'goto', fixup(this.pathname))
  }

  view.destroy = function(){
    for (var i = 0; i < links.length; i++){
      E.off(links[i], 'click', onLinkClicked)
    }
  }

  return view
}