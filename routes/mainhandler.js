const express = require('express')
const router = express.Router()
const { get } = require('request-promise');
const { InstaloginSession } = require('../middleware/loginsession');
const { Auth } = require('../models/methods/user_methods');
// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/post', InstaloginSession, async (req, res, next) => {
    const ig = req.ig
    const imageBuffer = await get({
        url: 'https://i.imgur.com/BZBHsauh.jpg',
        encoding: null,
    });

    await ig.publish.photo({
        file: imageBuffer,
        caption: 'Really nice photo from the internet!',
    });
    res.send("Done")
})

router.route('/getnetwork')
    .post(Auth, InstaloginSession, async (req, res) => {
        const ig = req.ig;
        try {
            // Get user ID and username of the searched user
            const user = await ig.user.searchExact(req.body.name);
            const userId = user.pk;
            const userUsername = user.username;

            // Get followers and following of the searched user
            const followers = await ig.feed.accountFollowers(userId).request();
            const following = await ig.feed.accountFollowing(userId).request();

            // Get current logged in user ID and username
            const currentUser = await ig.account.currentUser();
            const currentUserId = currentUser.pk;
            const currentUserUsername = currentUser.username;

            // Initialize arrays for nodes and edges
            const nodes = [];
            const edges = [];

            // Add nodes for searched user, current user, and their mutual followers/following
            nodes.push({ id: userId, label: userUsername, color: 'orange' }); // Searched user (orange)
            nodes.push({ id: currentUserId, label: currentUserUsername, color: 'blue' }); // Current user (blue)
            followers.users.forEach((follower) => {
                const id = follower.pk;
                const label = follower.username;
                nodes.push({ id: id, label: label, color: 'green' }); // Searched user's follower (green)
                edges.push({ from: userId, to: id }); // Edge from searched user to follower
                if (follower.is_private) {
                    edges.push({ from: id, to: currentUserId, color: 'red' }); // Edge from follower to current user (red if private)
                } else {
                    edges.push({ from: id, to: currentUserId }); // Edge from follower to current user (black if public)
                }
            });
            following.users.forEach((follow) => {
                const id = follow.pk;
                const label = follow.username;
                nodes.push({ id: id, label: label, color: 'purple' }); // Searched user's following (purple)
                edges.push({ from: id, to: userId }); // Edge from following to searched user
                if (follow.is_private) {
                    edges.push({ from: currentUserId, to: id, color: 'red' }); // Edge from current user to following (red if private)
                } else {
                    edges.push({ from: currentUserId, to: id }); // Edge from current user to following (black if public)
                }
            });

            // Remove duplicate nodes and edges
            const uniqueNodes = [...new Map(nodes.map((node) => [node.id, node])).values()];
            const uniqueEdges = [...new Map(edges.map((edge) => [`${edge.from}-${edge.to}`, edge])).values()];

            // Send response with unique nodes and edges
            res.status(200).json({ nodes: uniqueNodes, edges: uniqueEdges });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });


module.exports = router