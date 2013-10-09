var TextView = require('./text_view')
var ExerciseView = require('./exercise_view')

module.exports = PageView
function PageView(page){
  if (page.type === 'text'){
    return TextView(page)
  }else if (page.type === 'exercise'){
    return ExerciseView(page)
  }
}