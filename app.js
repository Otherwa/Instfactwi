
require("dotenv").config();
const RouterHandler = require('./routes/mainhandler')
const express = require('express')
const main = require('./routes/submainhandler')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 4000;

// config
mongoose.connect(process.env.CON, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => { console.log("Connected"); /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */ },
    err => { console.log("Error") /** handle initial connection error */ }
);


app.set('view engine', 'ejs');
app.set('json spaces', 2)
app.use((req, res, next) => {
    console.log('Time: ', new Date().toUTCString())
    next()
})

// routes
app.use('/', main)
app.use('/account', RouterHandler)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})