const mongoose = require('mongoose');

const AccountDetails = mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    }
})

const Account = mongoose.Schema({
    ig: {
        type: AccountDetails,
    },
    twt: {
        type: AccountDetails,
    },
    fb: {
        type: AccountDetails,
    }
})



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    account: {
        type: Account,
    }
}, { timestamps: true });



const User = mongoose.model('User', userSchema);

module.exports = User;
