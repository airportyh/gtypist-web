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

  isHidden.set(checkmark, !okToAdvance())

  E.on(textarea, 'keydown', onKeyDown)
  E.on(textarea, 'keyup', onKeyUp)

  function onKeyDown(e){
     // no backspacing
    if (e.keyCode === 8){
      e.preventDefault()
    }if (e.keyCode === 13 && okToAdvance()){
      e.preventDefault()
      textarea.disabled = true
      E.emit(view, 'advance', incorrectCount())
    }
  }

  function okToAdvance(){
    return textarea.value.length >= line.length
  }

  function onKeyUp(e){
    isHidden.set(checkmark, !okToAdvance())
    display.innerHTML = renderDisplay()
  }

  function renderDisplay(){
    var markup = ''
    var input = textarea.value
    var len = Math.max(input.length, line.length)
    for (var i = 0; i < len; i++){
      var leftChar = line.charAt(i)
      var rightChar = input.charAt(i)
      if (leftChar === rightChar){
        markup += '<span class=right>' + leftChar + '</span>'
      }else if (rightChar === ''){
        markup += leftChar
      }else if (leftChar === ''){
        markup += '<span class=wrong> </span>'
      }else{
        markup += '<span class=wrong>' + leftChar + '</span>'
      }
    }
    return markup
  }

  function incorrectCount(){
    var count = 0
    var input = textarea.value
    var len = Math.max(input.length, line.length)
    for (var i = 0; i < len; i++){
      var leftChar = line.charAt(i)
      var rightChar = input.charAt(i)
      if (leftChar === rightChar){
        // nothing
      }else if (rightChar === ''){
        // nothing
      }else if (leftChar === ''){
        count++
      }else{
        count++
      }
    }
    return count
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

  function reset(){
    textarea.value = ''
    display.innerHTML = line
    isHidden.set(checkmark, !okToAdvance())
  }

  var view = {
    element: element,
    focus: focus,
    destroy: destroy,
    reset: reset
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

styles.add('.exercise-line-view pre .wrong', {
  backgroundColor: 'red'
})

styles.add('.exercise-line-view pre .right', {
  color: 'green'
})