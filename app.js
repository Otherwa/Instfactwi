
require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose')
const flash = require('connect-flash');
const RouterHandler = require('./routes/mainhandler')
const main = require('./routes/submainhandler')

const app = express()
const port = process.env.PORT || 4000;

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));

// config
mongoose.connect(process.env.CON, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    (content) => { console.log(`Connected ${content}`); /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */ },
    err => { console.log("Error") /** handle initial connection error */ }
);

app.set('view engine', 'ejs');
app.set('json spaces', 2)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(flash());

app.use((req, res, next) => {
    console.log('Time: ', new Date().toUTCString())
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next()
})

// routes
app.use('/', main)
app.use('/account', RouterHandler)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})