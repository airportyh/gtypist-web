var h = require('hyperscript')
var E = require('emmitt')
var ExerciseView = require('./exercise_view')

function UI(lesson){
  var prompt
  var exerciseView
  var nextB
  var prevB
  var element = h('div',
    nextB = h('a', {href: '#', onclick: next}, 'Next'),
    prevB = h('a', {href: '#', onclick: prev}, 'Prev')
  )

  var exerciseIdx = 2
  displayExercise()

  function currentExercise(){
    return lesson[exerciseIdx]
  }

  function onAdvance(){
    console.log('advance exercise')
    next()
  }

  function displayExercise(){
    var exe = currentExercise()
    exerciseView = ExerciseView(exe)
    element.appendChild(exerciseView.element)
    exerciseView.focus()
    E.on(exerciseView, 'advance', onAdvance)
  }

  function destroyExercise(){
    E.off(exerciseView, 'advance', onAdvance)
    exerciseView.destroy()
    element.removeChild(exerciseView.element)
  }

  function next(){
    exerciseIdx++
    destroyExercise()
    displayExercise()
  }

  function prev(){
    exerciseIdx--
    destroyExercise()
    displayExercise()
  }

  function focus(){
    exerciseView.focus()
  }

  function destroy(){
    destroyExercise()
  }

  return {
    element: element,
    focus: focus,
    destroy: destroy
  }
}

window.onload = function(){
  getLesson(function(lesson){
    var ui = UI(lesson)
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