const express = require('express')
const app = express()
const Port = 3000
const broker = require('broker')
const sub = require('sub')


app.get('/',(req,res)=> res.send('Hello containers world!'))




app.listen(Port,()=>{
    console.log(`Rest API container is runnuing on port ${Port}`)
})
broker()
sub()

