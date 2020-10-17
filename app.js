const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 5000
const { MONGOURI } = require('./key')

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log("connected to mongoose")
})
mongoose.connection.on('error', (err) => {
    console.log("Error connecting", err)
})


require('./models/user')
app.use(express.json())
app.use(require('./routes/auth'))

app.listen(port, () => {
    console.log('server on')
})