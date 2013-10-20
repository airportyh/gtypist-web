var h = require('hyperscript')
var E = require('emmitt')
var PageView = require('./page_view')

module.exports = LessonView
function LessonView(lesson, nextLessonUrl){
  var exerciseView
  var element = h('div')
  var exerciseIdx = 0
  var totalIncorrectCount = 0
  displayExercise()

  function currentExercise(){
    return lesson.pages[exerciseIdx]
  }

  function onAdvance(incorrectCount){
    totalIncorrectCount += incorrectCount
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
    if (currentExercise()){
      displayCurrentExercise()
    }else{
      E.emit(view, 'finish')
    }
  }

  function displayCurrentExercise(){
    destroyExercise()
    displayExercise()
  }

  function focus(){
    if (exerciseView.focus) exerciseView.focus()
  }

  function destroy(){
    destroyExercise()
  }

  var view = {
    element: element,
    focus: focus,
    destroy: destroy
  }

  E.on(view, 'finish', function(){
    var options = AdvanceOptions(nextLessonUrl)
    view.element.appendChild(options.element)
    E.on(options, 'goto', function(path){
      E.emit(view, 'goto', path)
    })
  })

  return view
}

function AdvanceOptions(nextLessonUrl){

  var view = {
    element: h('div',
      nextLessonUrl ? h('button', 'Next Lesson', {onclick: nextLesson}) : null,
      h('button', 'Main Menu', {onclick: mainMenu})
    )
  }

  function nextLesson(){
    E.emit(view, 'goto', nextLessonUrl)
  }

  function mainMenu(){
    E.emit(view, 'goto', '/')
  }

  return view
}