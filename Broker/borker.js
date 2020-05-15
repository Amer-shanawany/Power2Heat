//MQTT Broker 
//const mosca = require('mosca')
const port = 1883
var settings = { port: port }
// var broker = new mosca.Server(settings)
// broker.on('ready',()=>{
//     console.log('Broker server is running')
// })

// broker.on('published',(packet)=>{
//     console.log(packet.payload.toString())
// })

const mqtt = require("mqtt")

var MQTT_TOPIC = "P2H/boilerdata";
var MQTT_ADDR = "mqtt://88.99.186.143";
var MQTT_PORT = 1883;

var client = mqtt.connect(MQTT_ADDR, {
  port: MQTT_PORT,
  clientId: 'AMERZXCV', //
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  connectTimeout: 1000,
  debug: true
});

client.on('connect', function () {
  console.log(`MQTT is connected to ${MQTT_ADDR} port: ${MQTT_PORT}`)
});

client.on('error', function (err) {
  console.log(err)``
  client.end()
})