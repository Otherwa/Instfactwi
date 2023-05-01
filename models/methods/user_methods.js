const User = require("../user");
const bcrypt = require("bcrypt")

// login session
function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/account/');
    }
}

function authenticateUser(email, password) {
    // console.log(email, password);
    return User.findOne({ email: email })
        .then(user => {
            if (!user) {
                // User not found
                return null;
            }
            return bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        // Passwords match
                        return user;
                    } else {
                        // Passwords do not match
                        return null;
                    }
                });
        })
        .catch(err => {
            console.error(err);
            return null;
        });
}
module.exports = { authenticateUser, requireLogin, User }