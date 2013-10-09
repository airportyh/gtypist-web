var E = require('emmitt')
var h = require('hyperscript')
var ajax = require('./ajax')
var MainMenu = require('./main_menu')
var LessonView = require('./lesson_view')
var SubMenu = require('./submenu')

module.exports = GTypistWeb

function GTypistWeb(){

  var element = h('gtypist')
  var currentView
  var view = { element: element }

  function goto(path){
    var url, m
    if (path === '/'){
      url = '/lessons/json/index.json'
      updateUrl(path)
      ajax(url, function(index){
        swapView(MainMenu(index))
      })
    }else if (m = path.match(/^\/([a-z0-9]+)\.html$/)){
      url = '/lessons/json/' + m[1] + '.json'
      updateUrl(path)
      ajax(url, function(lesson){
        swapView(SubMenu(lesson))
      })
    }else if (m = path.match(/^\/([a-z0-9]+)\/([0-9]+).html$/)){
      url = '/lessons/json/' + m[1] + '.json'
      var idx = Number(m[2])
      updateUrl(path)
      ajax(url, function(lesson){
        swapView(LessonView(lesson.lessons[idx]))
      })
    }else{
      console.error('Unknown url pattern:', path)
    }
  }

  function updateUrl(path){
    if (location.pathname === path) return
    if (history.pushState){
      history.pushState({}, '', path)
    }else{
      window.location = path
    }
  }

  function swapView(newView){
    if (currentView){
      destroyCurrentView()
    }
    currentView = newView
    E.on(currentView, 'goto', goto)
    element.appendChild(currentView.element)
  }

  function destroyCurrentView(){
    E.off(currentView, 'goto', goto)
    currentView.destroy()
    element.removeChild(currentView.element)
  }

  view.destroy = destroyCurrentView

  E.on(view, 'goto', goto)
  E.emit(view, 'goto', location.pathname)

  return view

}