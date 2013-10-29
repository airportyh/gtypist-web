var E = require('emmitt')
var h = require('hyperscript')
var ExerciseLineView = require('./exercise_line_view')
var styles = require('barber').styleSheet('gtypist')
var charCount = require('./exercise_char_count')
var calculateSpeed = require('./calculate_speed')
var SpeedDisplay = require('./speed_display')

module.exports = ExerciseView
function ExerciseView(exercise){
  
  var startTime, stopTime
  var prompt = h('label', exercise.prompt)
  var element = h('div.exercise-view', prompt)
  var lineViews = []
  var totalIncorrectCount = 0
  var currentLine = 0
  var view = {
    element: element,
    destroy: destroy,
    focus: focus
  }

  for (var i = 0; i < exercise.lines.length; i++){
    var lineView = ExerciseLineView(exercise.lines[i])
    E.on(lineView, 'advance', onAdvanceLine)
    lineViews.push(lineView)
    element.appendChild(lineView.element)
  }

  function onAdvanceLine(incorrectCount){
    totalIncorrectCount += incorrectCount
    currentLine++
    if (currentLine < lineViews.length){
      // advance line
      lineViews[currentLine].focus()
    }else{
      // exercise over
      finish()
    }
  }

  function finish(){
    stopTime = + new Date
    var duration = (stopTime - startTime) / 1000 / 60
    var chars = charCount(exercise)
    var speed = calculateSpeed(chars, duration, totalIncorrectCount)

    var errorRate = 100 * totalIncorrectCount / chars
    var display = SpeedDisplay(speed, errorRate)
    view.element.appendChild(display.element)
    var advanceOptions = AdvanceOptions(errorRate < 3)
    view.element.appendChild(advanceOptions.element)

    E.on(advanceOptions, 'again', function(){
      view.element.removeChild(display.element)
      view.element.removeChild(advanceOptions.element)
      currentLine = 0
      for (var i = 0; i < lineViews.length; i++){
        lineViews[i].reset()
      }
      totalIncorrectCount = 0
      focus()
    })
    
    E.on(advanceOptions, 'next', function(){
      view.element.removeChild(advanceOptions.element)
      E.emit(view, 'advance', totalIncorrectCount)
    })
  }

  function destroy(){
    for (var i = 0; i < lineViews.length; i++){
      E.off(lineViews[i], 'advance', onAdvanceLine)
    }
  }

  function focus(){
    lineViews[currentLine].focus()
    startTime = + new Date
  }

  return view

}

function AdvanceOptions(allowNext){

  var view = {
    element: h('div',
      h('button', 'Try Again', {onclick: tryAgain}),
      allowNext ? h('button', 'Next', {onclick: nextExercise}) : null
    )
  }

  function tryAgain(){
    E.emit(view, 'again')
  }

  function nextExercise(){
    E.emit(view, 'next')
  }

  return view
}

styles.add({
  '.exercise-view label': {
    fontSize: '1.2em'
  }
})