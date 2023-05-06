const { IgApiClient } = require('instagram-private-api');
const { EntityFactory } = require('instagram-private-api');
const punycode = require('punycode')

const InstaloginSession = async (req, res, next) => {
    try {
        // Create new Instagram API client instance
        const ig = new IgApiClient();

        // Get user credentials from request body
        console.log(req.session.user);
        var username = punycode.decode(req.session.user.account.ig.name), password = punycode.decode(req.session.user.account.ig.password, 'base64', 'ascii');

        ig.state.generateDevice(username);
        // username = username.trim();
        console.warn(username)
        // password = password.trim();
        // Log in the user with the provided credentials
        req.account_content = await ig.account.login(username, password);

        // Set the Instagram API client instance on the request object
        req.ig = ig;

        // Call next middleware function in the chain
        next();
    } catch (error) {
        console.error(error);
        res.status(202).json({ msg: error.message })
    }
};

module.exports = { InstaloginSession, EntityFactory }