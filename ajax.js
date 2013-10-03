// TODO: get this to work on older browsers
module.exports = ajax
function ajax(url, callback){
  var xhr = new XMLHttpRequest
  xhr.open('GET', url)
  xhr.onload = function(){  
    callback(JSON.parse(xhr.responseText))
  }
  xhr.send()
}