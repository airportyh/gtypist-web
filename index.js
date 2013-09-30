var h = require('hyperscript')
var o = require('observable')

function UI(lesson){
  var idx = o()
  idx(0)
  var exercise = lesson[idx()]
  var expectedText = o()
  expectedText(exercise.lines.join('\n'))
  var textarea = h('textarea', {'spellcheck': false}, {
    onkeydown: onKeyUp
  })
  var complete = o.compute([o.input(textarea), expectedText], function(text, expected){
    return text === expected
  })
  var preClass = o.compute([complete], function(good){
    return good ? 'good': ''
  })
  function onKeyUp(e){
    if (e.keyCode === 13){
      e.preventDefault()
      if (complete()){
        nextExercise()
      }
    }
  }
  function nextExercise(){
    idx(idx() + 1)
    exercise = lesson[idx()]
    expectedText(exercise.lines.join('\n'))
    textarea.value = ''
  }
  var ui = h('div',
    h('label', exercise.prompt),
    h('pre', {'className': preClass}, expectedText),
    textarea,
    h('label', 'idx:', idx)
  )
  return ui
}

window.onload = function(){
  getLesson(function(lesson){
    document.body.appendChild(UI(lesson))
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