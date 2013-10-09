var h = require('hyperscript')
var E = require('emmitt')

module.exports = SubMenu

function SubMenu(lesson){
  var view = {}
  var element = view.element = h('ul')
  var links = []

  for (var i = 0; i < lesson.lessons.length; i++){
    var link
    var sublesson = lesson.lessons[i]
    var item = h('li', 
      link = h('a', {
        href: '/' + lesson.id + '/' + i + '.html'
      }, sublesson.title)
    )
    links.push(link)
    E.on(link, 'click', onLinkClicked)
    element.appendChild(item)
  }

  function onLinkClicked(e){
    e.preventDefault()
    E.emit(view, 'goto', fixup(this.pathname))
  }

  function fixup(path){
    return path.charAt(0) === '/' ? path : '/' + path
  }

  view.destroy = function(){
    for (var i = 0; i < links.length; i++){
      E.off(links[i], 'click', onLinkClicked)
    }
  }

  return view
}