//MQTT Subscriber 
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://88.99.186.143:1883')
const topic = 'P2H/boilerdata'

client.on('message',(topic,message)=>{
    message = message.toString()
    console.log(message)
})
client.on('connect',()=>{
    client.subscribe(topic)
})
