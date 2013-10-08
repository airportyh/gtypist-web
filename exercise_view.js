var E = require('emmitt')
var h = require('hyperscript')
var ExerciseLineView = require('./exercise_line_view')
var styles = require('barber').styleSheet('exercise-view')

module.exports = ExerciseView
function ExerciseView(exercise){
  
  var prompt = h('label', exercise.prompt)
  var element = h('div.exercise-view', prompt)
  var lineViews = []
  var currentLine = 0
  var view = {
    element: element,
    destroy: destroy,
    focus: focus,
    children: lineViews
  }

  for (var i = 0; i < exercise.lines.length; i++){
    var lineView = ExerciseLineView(exercise.lines[i])
    E.on(lineView, 'advance', onAdvanceLine)
    lineViews.push(lineView)
    element.appendChild(lineView.element)
  }

  function onAdvanceLine(){
    currentLine++
    if (currentLine < lineViews.length){
      // advance line
      lineViews[currentLine].focus()
    }else{
      // exercise over
      E.emit(view, 'advance')
    }
  }

  function destroy(){
    for (var i = 0; i < lineViews.length; i++){
      E.off(lineViews[i], 'advance', onAdvanceLine)
    }
  }

  function focus(){
    lineViews[currentLine].focus()
  }

  return view

}

styles.add('.exercise-view label', {
  fontSize: '1.2em'
})