var hypercore = require('hypercore')
var ram = require('random-access-memory')
var signalhub = require('signalhub')
var webrtcSwarm = require('webrtc-swarm')

var initHypercore = () => {
  return new Promise((resolve) => {
    const log = hypercore(ram)
    log.on('ready', () => {resolve(log)})
  })
}

initHypercore().then((log1) => {
  initHypercore().then((log2) => {

  console.log('log1: ' + log1.key.toString('hex'))
  console.log('log2: ' + log2.key.toString('hex'))

  const hub = signalhub('channel', ['https://p2p-editor.codely.tv:8080'])

  const swarm = webrtcSwarm(hub)

  swarm.on('peer', (peer) => {
     const stream = log1.replicate({live: true, encrypt: false})
     log2.replicate({stream: stream})
     peer.pipe(stream).pipe(peer)  
  })

  log1.append('db1')
  log2.append('db2')

  log1.createReadStream({live: true})
    .on('data', (data) => {
      console.log('log1: ' + data.toString())
    })

  log2.createReadStream({live: true})
    .on('data', (data) => {
      console.log('log2: ' + data.toString())
    })
  })
})

