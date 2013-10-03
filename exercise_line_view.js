var E = require('emmitt')
var h = require('hyperscript')
var hasClass = require('./hasclass')

module.exports = ExerciseLineView
function ExerciseLineView(line){

  var display
  var textarea
  var element = h('div', 
    display = h('pre', line),
    textarea = h('input', {
      'className': 'textarea',
      'type': 'text',
      'spellcheck': false,
      'disabled': true
    })
  )
  E.on(textarea, 'keydown', onKeyDown)
  E.on(textarea, 'keyup', onKeyUp)

  function onKeyDown(e){
     // no backspacing
    if (e.keyCode === 8){
      e.preventDefault()
    }if (e.keyCode === 13 && okToAdvance()){
      e.preventDefault()
      textarea.disabled = true
      E.emit(view, 'advance')
    }
  }

  function okToAdvance(){
    return textarea.value.length >= line.length
  }

  function onKeyUp(e){
    hasClass(display, 'good', textMatches())
  }

  function textMatches(){
    return line === textarea.value
  }

  function focus(){
    textarea.disabled = false
    textarea.focus()
  }

  function destroy(){
    E.off(textarea, 'keydown', onKeyDown)
    E.off(textarea, 'keyup', onKeyUp)
  }

  var view = {
    element: element,
    focus: focus,
    destroy: destroy
  }

  return view
}
