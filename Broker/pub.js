//MQTT Publisher

//const topic = 'Temp'
//var message = 'Hello !'

// client.on('connect', () => {
//     setInterval(() => {
//         client.publish(topic, message)
//         console.log('message sent')
//     }, 5000);
// })
module.exports = function (topic, message) {
    const mqtt = require('mqtt')
    const client = mqtt.connect('mqtt://88.99.186.143:1883')
    client.on('connect', () => {

        client.publish(topic, message)
        console.log(`MQTT publish @topic: ${topic} @message: ${message}`)

    })

}


