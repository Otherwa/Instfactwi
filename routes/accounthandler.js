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
                username: req.body.username,
                password: req.body.password,
            });

            // Save the user to the database
            await newUser.save();

            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/register')
        } catch (error) {
            console.error(error);
            res.status(500).send('Unable to register user. Please try again later.');
        }
    })

module.exports = router