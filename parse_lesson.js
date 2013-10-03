var fs = require('fs')
var file = process.argv[2]

//console.log('parsing', file)

fs.readFile(file, function(err, data){
  var text = '' + data
  var lines = text.split('\n')
  //console.log('# of lines', lines.length)
  var exercises = []
  var reading = null
  var prompt = null
  var exeLines = null
  lines.forEach(function(line){
    var m
    if (line.match(/^\s*\#/)){
      // ignore comments
    }else if (line.match(/^\s*$/)){
      // empty line signals end of section
      if (prompt && exeLines){
        exercises.push({
          type: 'exercise',
          prompt: prompt,
          lines: exeLines
        })
        prompt = null
        exeLines = null
        reading = null
      }else if (reading){
        exercises.push({
          type: 'text',
          text: reading
        })
        prompt = null
        exeLines = null
        reading = null
      }
      // ignore empty lines
    }else if (m = line.match(/^I\:(.+)$/)){
      prompt = m[1]
    }else if (m = line.match(/^D\:(.+)$/)){
      exeLines = [m[1]]
    }else if (m = line.match(/^ :(.+)$/)){
      if (exeLines){
        exeLines.push(m[1])
      }else if (reading){
        reading += '\n' + m[1]
      }else if (exeLines){
        prompt += '\n' + m[1]
      }
    }else if (m = line.match(/^T\:(.*)$/)){
      reading = m[1] || '\n'
    }else{
      // ignore
      //console.log(line)
    }
  })
  console.log(JSON.stringify(exercises, null, '  '))
})
