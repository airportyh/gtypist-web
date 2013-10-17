var isHidden = module.exports = function(elm){
  return elm.style.visibility === 'hidden'
}

isHidden.set = function(elm, yes){
  elm.style.visibility = yes ?
    'hidden' :
    'visible'
}