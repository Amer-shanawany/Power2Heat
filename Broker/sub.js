//MQTT Subscriber 
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')
const topic = 'Temp'

client.on('message',(topic,message)=>{
    message = message.toString()
    console.log(message)
})
client.on('connect',()=>{
    client.subscribe(topic)
})