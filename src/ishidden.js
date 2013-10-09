module.exports = function(elm, yes){
  if (arguments.length === 1){
    // getter
    return elm.style.visibility === 'hidden'
  }else{
    // setter
    elm.style.visibility = yes ?
      'hidden' :
      'visible'
  }
}