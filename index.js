var h = require('hyperscript')
var E = require('emmitt')
var LessonView = require('./lesson_view')
var ajax = require('./ajax')

window.onload = main
function main(){
  var ui = GTypistWeb()
  document.body.appendChild(ui.element)
}

function GTypistWeb(){

  var element = h('gtypist')
  var currentView
  var view = { element: element }

  function goto(url){
    ajax(url, function(obj){
      if (currentView){
        E.off(currentView, 'goto', goto)
        currentView.destroy()
        element.innerHTML = ''
      }
      
      if (isIndex(obj)){
        currentView = MainMenu(obj) 
      }else{
        currentView = LessonView(obj)
      }
      E.on(currentView, 'goto', goto)

      element.appendChild(currentView.element)
    })
  }

  function isIndex(obj){
    return !obj.title
  }

  goto('lessons/index.json')

  return view

}

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



/*
window.onload = function(){
  getLesson(function(lesson){
    var ui = LessonView(lesson)
    document.body.appendChild(ui.element)
    ui.focus()
  })
}

function getLesson(callback){
  var xhr = new XMLHttpRequest
  xhr.open('GET', 'q.json')
  xhr.onload = function(){  
    var lesson = JSON.parse(xhr.responseText)
    callback(lesson)
  }
  xhr.send()
}
*/