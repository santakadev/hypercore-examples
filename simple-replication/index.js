var hypercore = require('hypercore')
var hyperdiscovery = require('hyperdiscovery')

var log = hypercore('./db')

log.on('ready', () => {
  console.log(log.key.toString('hex'))
  hyperdiscovery(log)
})

process.stdin.on('data', function(data) {
  log.append(data)
})

log.createReadStream({live: true})
  .on('data', function(data) {
    console.log(data.toString())
  })

