var fs = require('fs')
var file = process.argv[2]

module.exports = parseLesson
function parseLesson(file, callback){

  fs.readFile(file, function(err, data){
    var lines = ('' + data).split('\n')
    //console.log('# of lines', lines.length)
    var exercises = []
    var text = null
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
          text = null
        }else if (text){
          exercises.push({
            type: 'text',
            title: text.title,
            text: text.text
          })
          prompt = null
          exeLines = null
          text = null
        }
        // ignore empty lines
      }else if (m = line.match(/^I\:(.+)$/)){
        prompt = m[1]
      }else if (m = line.match(/^D\:(.+)$/)){
        exeLines = [m[1]]
      }else if (m = line.match(/^ :(.+)$/)){
        if (exeLines){
          exeLines.push(m[1])
        }else if (text){
          if (!text.title){
            text.title = m[1].trim()
          }else{
            text.text += '\n' + m[1]
          }
        }else if (exeLines){
          prompt += '\n' + m[1]
        }
      }else if (m = line.match(/^T\:(.*)$/)){
        text = {
          title: m[1].trim(),
          text: ''
        }
      }else{
        // ignore
        //console.log(line)
      }
    })
    callback(exercises)
  })
}