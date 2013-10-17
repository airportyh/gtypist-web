var h = require('hyperscript')
var E = require('emmitt')
var PageView = require('./page_view')
var calculateSpeed = require('./calculate_speed')
var SpeedDisplay = require('./speed_display')
var charCount = require('./lesson_char_count')

module.exports = LessonView
function LessonView(lesson, nextLessonUrl){
  var exerciseView
  var element = h('div')
  var startTime, stopTime
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
    startTime = + new Date
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
    stopTime = + new Date
    var duration = (stopTime - startTime) / 1000 / 60
    var chars = charCount(lesson)
    var speed = calculateSpeed(chars, duration, totalIncorrectCount)

    var errorRate = 100 * totalIncorrectCount / chars
    var display = SpeedDisplay(speed, errorRate)
    view.element.appendChild(display.element)
    var advanceOptions = AdvanceOptions(errorRate < 3 ? nextLessonUrl : null)
    view.element.appendChild(advanceOptions.element)

    E.on(advanceOptions, 'again', function(){
      view.element.removeChild(display.element)
      view.element.removeChild(advanceOptions.element)
      exerciseIdx = 0
      displayCurrentExercise()
    })
    
    E.on(advanceOptions, 'next', function(){
      E.emit(view, 'goto', nextLessonUrl)
    })
    
  })

  return view
}

function AdvanceOptions(nextLessonUrl){

  var view = {
    element: h('div',
      h('button', 'Try Again', {onclick: tryAgain}),
      nextLessonUrl ? h('button', 'Next Lesson', {onclick: nextLesson}) : null
    )
  }

  function tryAgain(){
    E.emit(view, 'again')
  }

  function nextLesson(){
    E.emit(view, 'next')
  }

  return view
}
