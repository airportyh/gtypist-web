var h = require('hyperscript')

module.exports = SpeedDisplay
function SpeedDisplay(speeds, errorRate){
  var view = {
    element: h('p', 
      h('span', 'Raw speed: ' + speeds.raw.toFixed(2), ' wpm'), h('br'),
      h('span', 'Adjusted speed: ' + speeds.adjusted.toFixed(2), ' wpm'), h('br'),
      h('span', h('label', 
        'With ' + errorRate.toFixed(1) + '% errors'), h('br')),
      errorRate > 3 ? h('span', 'Your error-rate is too high. You have to achive 3.0%') : null
    )
  }

  return view
}

