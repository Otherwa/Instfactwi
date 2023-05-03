const User = require("../user");
const bcrypt = require("bcrypt")

// login session
function Auth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/account/');
    }
}

function authenticateUser(req, email, password) {
    // console.log(email, password);
    return User.findOne({ email: email })
        .then(user => {
            if (!user) {
                // User not found
                req.flash('error', "No User Found")
                return null;
            }
            return bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        // Passwords match
                        return user;
                    } else {
                        // Passwords do not match
                        req.flash('error', "Password Not Valid")
                        return null;
                    }
                });
        })
        .catch(err => {
            console.error(err);
            return null;
        });
}

function updateprofile(req, res, email, igname, igpass) {
    return User.findOneAndUpdate({ email: email }, { $set: { 'account.ig.name': igname, 'account.ig.password': igpass } }, { new: true })
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => {
            console.error(err);
            return null;
        });
}
module.exports = { authenticateUser, Auth, User, updateprofile }