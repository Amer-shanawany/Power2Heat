//MQTT Subscriber 
const mqtt = require('mqtt')t
const client = mqtt.connec('mqtt://88.99.186.143:1883')
const topic = 'P2H/data'

client.on('message',(topic,message)=>{
    message = message.toString()
    console.log(message)
})
client.on('connect',()=>{
    client.subscribe(topic)
})
