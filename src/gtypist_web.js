var E = require('emmitt')
var h = require('hyperscript')
var ajax = require('./ajax')
var MainMenu = require('./main_menu')
var LessonView = require('./lesson_view')
var SubMenu = require('./submenu')
var Router = require('66')

module.exports = GTypistWeb

function GTypistWeb(){

  var element = h('gtypist')
  var currentView
  var view = { element: element }

  var rt = new Router()

  rt.get('/', function(){
    url = '/lessons/json/index.json'
    ajax(url, function(index){
      swapView(MainMenu(index))
    })
  })

  rt.get('/:lesson.html', function(params){
    url = '/lessons/json/' + params.lesson + '.json'
    ajax(url, function(lesson){
      swapView(SubMenu(lesson))
    })
  })

  rt.get('/:lesson/:sublesson.html', function(params){
    url = '/lessons/json/' + params.lesson + '.json'
    ajax(url, function(lesson){
      var idx = Number(params.sublesson)
      var subLesson = lesson.lessons[idx]
      var nextLesson = lesson.lessons[idx + 1]
      var nextLessonUrl = nextLesson ? 
        '/' + params.lesson + '/' + (idx + 1) + '.html' :
        null
      var view = LessonView(subLesson, nextLessonUrl)
      swapView(view)
    })
  })

  rt.start()

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

  function goto(path){
    rt.goto(path)
  }

  return view

}