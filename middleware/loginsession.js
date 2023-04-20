const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');

const InstaloginSession = async (req, res, next) => {
    try {
        // Create new Instagram API client instance
        const ig = new IgApiClient();

        // Get user credentials from request body
        const username = process.env.IG_USERNAME, password = process.env.IG_PASSWORD;

        // Generate a new device ID for the session
        ig.state.generateDevice(username);

        // Log in the user with the provided credentials
        req.account_contnet = await ig.account.login(username, password);

        // Set the Instagram API client instance on the request object
        req.ig = ig;

        // Call next middleware function in the chain
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send('Unable to log in. Please check your username and password and try again.');
    }
};

module.exports = { InstaloginSession }