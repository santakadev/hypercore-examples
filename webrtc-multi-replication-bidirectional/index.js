var hypercore = require('hypercore')
var ram = require('random-access-memory')
var webrtcSwarm = require('webrtc-swarm')
var signalhub = require('signalhub')

var key = document.getElementById('key').value || null
var log = hypercore(ram, key)

log.on('ready', function() {
  console.log(log.key.toString('hex'))

  var myLog = hypercore(ram)
  myLog.on('ready', function() {

  var hub = signalhub(log.key.toString('hex'), [
    'https://p2p-editor.codely.tv:8080'
  ])

  var uuid = myLog.key.toString('hex')
  console.log(uuid)
  var sw = webrtcSwarm(hub, {uuid: uuid})

  
  sw.on('peer', function(peer, peerId) {
    console.log('new peer')
    var remoteLog = hypercore(ram, peerId)
    remoteLog.on('ready', function() {
      var stream = log.replicate({live: true, encrypt: false})
      myLog.replicate({stream: stream})
      remoteLog.replicate({stream: stream})
      peer.pipe(stream).pipe(peer)

      remoteLog.createReadStream({live: true})
	    .on('data', (data) => {console.log(data.toString())})
    })
  })
  
  myLog.append(uuid + ': hi')

  })
})

log.createReadStream({live: true})
  .on('data', function (data) {
      console.log(data.toString())
  })
