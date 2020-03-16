//MQTT Broker 
const mosca = require('mosca')
const port= 1883 
var settings  = {port : port}
var broker = new mosca.Server(settings)
broker.on('ready',()=>{
    console.log('Broker server is running')
})

broker.on('published',(packet)=>{
    console.log(packet.payload.toString())
})