var h = require('hyperscript')
var o = require('observable')

function UI(lesson){
  var idx = o()
  idx(0)
  var exercise = lesson[idx()]
  var expectedText = o()
  var prompt = o()
  var textarea = h('textarea', {
    'spellcheck': false, 
    'rows': 1
  }, {
    onkeydown: onKeyDown
  })
  var text = o.input(textarea)
  var expectedTextDisplay = o.compute(
    [text, expectedText], function(text, expected){
      console.log('text', text, 'expected', expected)
      
      for (var i = text.length; i--;){
        var sub = text.substring(0, i + 1)
        if (expected.substring(0, sub.length) === sub){
          break
        }
      }
      console.log('i', i, 'sub', sub)
      if (!expected){
        return ''
      }
      if (!sub){
        return expected
      }else{
        return h('span', 
            h('span', {className: 'good'}, expected.substring(0, i + 1)),
            h('span', {className: 'bad'}, expected.substring(i + 1, text.length)),
            h('span', expected.substring(text.length))
          )
      }
    })
  var complete = o.compute(
    [text, expectedText], function(text, expected){
      return text === expected
    })
  var preClass = o.compute([complete], function(good){
    return good ? 'good': ''
  })
  advanceExercise(exercise)
  function onKeyDown(e){
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
    advanceExercise(exercise)
    
  }
  function advanceExercise(exercise){
    text('')
    expectedText(exercise.lines.join('\n'))
    prompt(exercise.prompt)
  }
  var ui = h('div',
    h('label', prompt),
    h('pre', {'className': preClass}, expectedTextDisplay),
    textarea
  )

  setTimeout(function(){
    textarea.focus()
  }, 0)
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