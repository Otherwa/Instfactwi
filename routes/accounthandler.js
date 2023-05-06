const express = require('express')
const { authenticateUser, Auth, User, updateprofile, Credentials } = require('../models/methods/user_methods');
const router = express.Router()
const bcrypt = require('bcrypt');
const punycode = require('punycode');
const NetworkActions = require('./mainhandler');
const { InstaloginSession } = require('../middleware/loginsession');

// entry point
router.use('/network', NetworkActions)

router.route('/')
    .get((req, res) => {
        res.render('account/login', { error: req.flash('error') });
    })
    .post((req, res) => {

    })

router.route('/login')
    .post((req, res) => {
        // console.log(req.body)
        const { email, password } = req.body;
        authenticateUser(req, email, password)
            .then(user => {

                if (user) {
                    req.session.user = user;
                    console.log(req.session)
                    res.redirect('/account/dashboard');
                } else {
                    res.redirect('/account');
                }
            });
    })

router.route('/register')
    .get((req, res) => {
        res.render('account/register', { falmsg: req.flash('falmsg'), sucmsg: req.flash('sucmsg') });
    })
    .post(async (req, res) => {
        console.log(req.body)
        // Create a new user with the provided credentials
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                const newUser = new User({
                    email: req.body.email,
                    password: hash,
                    account: {
                        ig: { name: null, password: null }, twt: { name: null, password: null }, fb: { name: null, password: null }
                    }
                });
                newUser.save().then(user => {
                    req.flash('sucmsg', 'You are now registered and can log in');
                    res.redirect('/account/register')
                }).catch(err => {
                    console.log(err)
                    req.flash('falmsg', 'This Email Already has an Account');
                    res.redirect('/account/register')
                })
            })
        })

    })

router.route('/logout')
    .get(Auth, (req, res) => {
        req.session.destroy()
        res.redirect('/account')
        console.log(req.session)
    })

router.route('/dashboard')
    .get(Auth, Credentials, (req, res) => {
        const user = req.session.user
        res.render('account/dashboard', { title: 'Dashboard', user: user })
    })
    .put(Auth, Credentials, InstaloginSession, (req, res) => {
        const details = req.account_content
        res.json({ details: details })
    })

router.route('/profile')
    .get(Auth, (req, res) => {
        const user = req.session
        req.session.email = req.session.user.email
        req.session.name = punycode.decode(req.session.user.account.ig.name)
        req.session.password = punycode.decode(req.session.user.account.ig.password)
        console.log(req.session.user)
        res.render('account/profile', { user: user, title: 'Profile', msg: req.flash('sucmsg') })
    })
    .post(Auth, Credentials, (req, res) => {
        console.log(req.body)
        let { email, igname, igpass } = req.body
        igname = punycode.encode(igname)
        igpass = punycode.encode(igpass)
        updateprofile(req, res, email, igname, igpass).then(user => {
            req.session.user = user
            req.flash('sucmsg', 'Profile Updated')
            res.redirect('/account/profile');
        });
    })

router.route('/post')
    .get(Auth, Credentials, (req, res) => {
        const user = req.session.user
        res.render('account/post', { user: user, title: 'Posts' })
    })



router.route('/network')
    .get(Auth, Credentials, async (req, res) => {
        const user = req.session.user
        res.render('account/network', { user: user, title: 'Network' })
    })

module.exports = router