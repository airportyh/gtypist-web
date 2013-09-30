var fs = require('fs')
var file = process.argv[2]

//console.log('parsing', file)

fs.readFile(file, function(err, data){
  var text = '' + data
  var lines = text.split('\n')
  //console.log('# of lines', lines.length)
  var exercises = []
  var exercise = null
  lines.forEach(function(line){
    var m
    if (line.match(/^\s*\#/)){
      // ignore comments
    }else if (line.match(/^\s*$/)){
      if (exercise){
        exercises.push(exercise)
        exercise = null
      }
      // ignore empty lines
    }else if (m = line.match(/^I\:(.+)$/)){
      exercise = {
        prompt: m[1],
        lines: []
      }
    }else if (m = line.match(/^D\:(.+)$/)){
      if (!exercise) return
      exercise.lines.push(m[1])
    }else if (m = line.match(/^ :(.+)$/)){
      if (!exercise) return
      exercise.lines.push(m[1])
    }else{
      //console.log(line)
    }
  })
  console.log(JSON.stringify(exercises, null, '  '))
})
