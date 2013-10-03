var h = require('hyperscript')
var E = require('emmitt')
var PageView = require('./page_view')

module.exports = LessonView
function LessonView(lesson){
  lesson = lesson.pages
  var prompt
  var exerciseView
  var element = h('div')

  var exerciseIdx = 0
  displayExercise()

  function currentExercise(){
    return lesson[exerciseIdx]
  }

  function onAdvance(){
    next()
  }

  function displayExercise(){
    var exe = currentExercise()
    exerciseView = PageView(exe)
    element.appendChild(exerciseView.element)
    focus()
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

  function focus(){
    if (exerciseView.focus) exerciseView.focus()
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