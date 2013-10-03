module.exports = hasClass
// TODO: make work on old IEs
function hasClass(elm, clazz, yes){
  if (arguments.length === 3){
    // setter
    var classes = elm.className.split(/\s+/)
    var idx = classes.indexOf(clazz)
    if (yes){
      if (idx === -1) classes.push(clazz)
    }else{
      if (idx !== -1){
        classes.splice(idx, 1)
      }
    }
    elm.className = classes.join(' ')
  }else{
    // getter
    var classes = elm.className.split(/\s+/)
    return classes.indexOf(clazz) !== -1
  }
}