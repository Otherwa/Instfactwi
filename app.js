
require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose')
const flash = require('connect-flash');
const AccountActions = require('./routes/mainhandler')
const Main = require('./routes/accounthandler');
const path = require('path')

const app = express()
const port = process.env.PORT || 4000;

app.use(express.static('public'))

app.use(session({
    secret: process.env.SECRET_KEY,
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
    res.locals.msg = req.flash('msg');
    res.locals.error_msg = req.flash('error_msg');
    next()
})

// routes
app.use('/account', Main)
app.use('/account/actions', AccountActions)

// entry points
app.get('/', (req, res) => {
    res.status(200).render('index', { 'title': 'Home', 'message': 'Nice' })
})

app.get('*', (req, res) => {
    res.status(200).render('err')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})