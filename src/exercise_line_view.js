var E = require('emmitt')
var h = require('hyperscript')
var isHidden = require('./ishidden')
var styles = require('barber').styleSheet('gtypist')

module.exports = ExerciseLineView
function ExerciseLineView(line){

  var display
  var textarea
  var checkmark
  var element = h('div.exercise-line-view', 
    display = h('pre', line),
    checkmark = h('span.checkmark', '   \u2713'),
    textarea = h('input.textarea', {
      'type': 'text',
      'spellcheck': false,
      'disabled': true
    })
  )

  isHidden(checkmark, !okToAdvance())

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
    isHidden(checkmark, !okToAdvance())
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

styles.add('.exercise-line-view .checkmark', {
  color: 'green'
})

styles.add('.exercise-line-view .textarea, .exercise-line-view pre', {
  fontFamily: 'monaco, monospace', 
  fontSize: '1em',
  width: '100%'
})

styles.add('.exercise-line-view .textarea', {
  background: 'yellow',
  border: '0px none'
})

styles.add('.exercise-line-view .textarea:disabled', {
  background: 'gray'
})

styles.add('.exercise-line-view pre', {
  display: 'inline',
  margin: '0px',
  border: '1px solid white'
})

