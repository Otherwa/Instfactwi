const express = require('express')
const User = require('../models/user')
const router = express.Router()


// entry point

router.route('/login')
    .get((req, res) => {
        res.render('account/login');
    })
    .post((req, res) => {

    })

router.route('/register')
    .get((req, res) => {
        res.render('account/register');
    })
    .post(async (req, res) => {
        try {
            console.log(req.body)
            // Create a new user with the provided credentials
            const newUser = new User({
                email: req.body.email,
                password: req.body.password,
            });

            // Save the user to the database
            await newUser.save();

            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/account/login')
        } catch (error) {
            console.error(error);
            req.flash('success_msg', 'Error 404');
            res.redirect('/account/register')
        }
    })

module.exports = router