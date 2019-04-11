var hypercore = require('hypercore')
var hyperdiscovery = require('hyperdiscovery')

var log = hypercore('./db-clone', '3655bc29cbe31746ddc097c170bc8983aa588047ffd2a3fe0d9e6f94eab79700')

log.on('ready', function() {
  hyperdiscovery(log)
})

log.createReadStream({live: true})
  .on('data', function(data) {
    console.log(data.toString())
  })

