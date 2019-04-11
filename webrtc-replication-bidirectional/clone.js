var hypercore = require('hypercore')
var ram = require('random-access-memory')
var signalhub = require('signalhub')
var webrtcSwarm = require('webrtc-swarm')

var initHypercore = (key) => {
  return new Promise((resolve) => {
    const log = hypercore(ram, key)
    log.on('ready', () => {resolve(log)})
  })
}

initHypercore().then((myLog) => {

  console.log(myLog.key.toString('hex'))

  const hub = signalhub('webrtc-replication-bidirectional', ['https://p2p-editor.codely.tv:8080'])

  const swarm = webrtcSwarm(hub, {uuid: myLog.key.toString('hex')})

  swarm.on('peer', (peer, peerId) => {
    console.log('peer connected')

    initHypercore(peerId).then((remoteLog) => {
      const stream = remoteLog.replicate({live: true, encrypt: false})
      myLog.replicate({stream: stream})
      peer.pipe(stream).pipe(peer)

      remoteLog.createReadStream({live: true})
        .on('data', (data) => {
            console.log(data.toString())
        })
    })
  })

  myLog.append(myLog.key.toString('hex') + ': hi')
})
