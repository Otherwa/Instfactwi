const express = require('express')
const router = express.Router()

// entry points
router.get('/', (req, res) => {
    res.status(200).render('index', { 'title': 'Home', 'message': 'Nice' })
})

router.route('/login')
    .get((req, res) => {
        req.render('index');
    })
    .post((req, res) => {

    })

router.route('/register')
    .get((req, res) => {
        req.render('index');
    })
    .post(async (req, res) => {
        try {
            // Create a new user with the provided credentials
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
            });

            // Save the user to the database
            await newUser.save();

            res.send('User registered successfully!');
        } catch (error) {
            console.error(error);
            res.status(500).send('Unable to register user. Please try again later.');
        }
    })

module.exports = router