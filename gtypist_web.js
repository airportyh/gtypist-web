var E = require('emmitt')
var h = require('hyperscript')
var ajax = require('./ajax')
var MainMenu = require('./main_menu')
var LessonView = require('./lesson_view')

module.exports = GTypistWeb

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