const express = require('express')
const { authenticateUser, requireLogin, User } = require('../models/methods/user_methods');
const router = express.Router()
const bcrypt = require('bcrypt');
// entry point

router.route('/')
    .get((req, res) => {
        res.render('account/login');
    })
    .post((req, res) => {

    })

router.route('/login')
    .post((req, res) => {
        // console.log(req.body)
        const { email, password } = req.body;
        authenticateUser(email, password)
            .then(user => {
                console.table(user);
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

router.route('/dashboard')
    .get(requireLogin, (req, res) => {
        const user = req.session.user
        res.render('account/dashboard', { user: user })
    })

module.exports = router