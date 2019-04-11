var hypercore = require('hypercore')
var ram = require('random-access-memory')
var signalhub = require('signalhub')
var webrtcSwarm = require('webrtc-swarm')

const key1 = '8cb54b873947dfbda1182d5fff1521198150f13637e2c89402bde07089758fd7';
const key2 = '545046cf6658b1cf53d08d73535abb2c563f783fbba474a532996ed8cb689c63';

var initHypercore = (key) => {
  return new Promise((resolve) => {
    const log = hypercore(ram, key)
    log.on('ready', () => {resolve(log)})
  })
}

initHypercore(key1).then((log1) => {
  initHypercore(key2).then((log2) => {

  const hub = signalhub('channel', ['https://p2p-editor.codely.tv:8080'])

  const swarm = webrtcSwarm(hub)

  swarm.on('peer', (peer) => {
     const stream = log1.replicate({live: true, encrypt: false})
     log2.replicate({stream: stream})
     peer.pipe(stream).pipe(peer)  
  })

  log1.createReadStream({live: true})
    .on('data', (data) => {
      console.log(data.toString())
    })

  log2.createReadStream({live: true})
    .on('data', (data) => {
      console.log(data.toString())
    })

  })
})

