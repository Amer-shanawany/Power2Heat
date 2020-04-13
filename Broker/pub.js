//MQTT Publisher
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')
const topic = 'Temp'
var message = 'Hello !'

client.on('connect',()=>{
    setInterval(() => {
        client.publish(topic,message)
        console.log('message sent')
    }, 5000);
})
