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
            var followers = await ig.feed.accountFollowers(userId).request();
            while (ig.feed.accountFollowers(userId).isMoreAvailable()) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                const nextFollowers = await ig.feed.accountFollowers(userId).request();
                followers = followers.concat(nextFollowers);
            }

            var following = await ig.feed.accountFollowing(userId).request();
            while (ig.feed.accountFollowing(userId).isMoreAvailable()) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                const nextFolloweing = await ig.feed.accountFollowing(userId).request();
                following = followers.concat(nextFolloweing);
            }

            // Get current logged in user ID and username
            const currentUser = await ig.account.currentUser();
            const currentUserId = currentUser.pk;
            const currentUserUsername = currentUser.username;

            // Get followers and following of the searched user
            var currentUserFollowers = await ig.feed.accountFollowers(currentUserId).request();
            while (ig.feed.accountFollowers(currentUserId).isMoreAvailable()) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                const nextFollowers = await ig.feed.accountFollowers(currentUserId).request();
                currentUserFollowers = currentUserFollowers.concat(nextFollowers);
            }


            var currentUserFollowing = await ig.feed.accountFollowing(currentUserId).request();
            while (ig.feed.accountFollowing(currentUserId).isMoreAvailable()) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                const nextFolloweing = await ig.feed.accountFollowing(currentUserId).request();
                currentUserFollowing = currentUserFollowing.concat(nextFolloweing);
            }

            // Initialize arrays for nodes and edges
            var nodes = [];
            var edges = [];
            var non_nodes = [];
            // Add nodes for searched user, current user, and their mutual followers/following
            nodes.push({ id: userId, label: userUsername, color: '#FFE74C' }); // Searched user (#FFE74C)
            nodes.push({ id: currentUserId, label: currentUserUsername, color: '#FFE74C' }); // Current user (blue)
            // hit
            non_nodes.push({ id: userId, label: userUsername, color: '#FFE74C' }); // Searched user (#FFE74C)
            non_nodes.push({ id: currentUserId, label: currentUserUsername, color: '#FFE74C' });


            followers.users.forEach((follower) => {
                const id = follower.pk;
                const label = follower.username;
                currentUserFollowing.users.forEach((user) => {
                    non_nodes.push({ id: id, label: label, color: '#D72638' });
                    if (user.pk === id) {
                        nodes.push({ id: id, label: label, color: '#6BF178' }); // Searched user's follower (#6BF178)
                        edges.push({ from: userId, to: id }); // Edge from searched user to follower
                        if (follower.is_private) {
                            edges.push({ from: id, to: currentUserId, color: '#D72638' }); // Edge from follower to current user (#D72638 if private)
                        } else {
                            edges.push({ from: id, to: currentUserId, color: '#6BF178' }); // Edge from follower to current user (black if public)
                        }
                    }
                })
            });

            // hit
            following.users.forEach((follower) => {
                const id = follower.pk;
                const label = follower.username;
                currentUserFollowers.users.forEach((user) => {
                    if (user.pk === id) {
                        nodes.push({ id: id, label: label, color: '#6BF178' }); // Searched user's follower (#6BF178)
                        edges.push({ from: userId, to: id }); // Edge from searched user to follower
                        if (follower.is_private) {
                            edges.push({ from: id, to: currentUserId, color: '#D72638' }); // Edge from follower to current user (#D72638 if private)
                        } else {
                            edges.push({ from: id, to: currentUserId, color: '#6BF178' }); // Edge from follower to current user (black if public)
                        }
                    }
                })
            });

            var nonuniqueNodes = [...new Map(non_nodes.map((node) => [node.id, node])).values()];
            // Remove duplicate nodes and edges

            var uniqueNodes = [...new Map(nodes.map((node) => [node.id, node])).values()];
            var uniqueEdges = [...new Map(edges.map((edge) => [`${edge.from}-${edge.to}`, edge])).values()];

            var nonodes = nonuniqueNodes.filter(function (objFromA) {
                return !uniqueNodes.find(function (objFromB) {
                    return objFromA.id === objFromB.id
                })
            })

            var noNodes = [...new Map(nonodes.map((node) => [node.id, node])).values()]

            noNodes.forEach(node => {
                uniqueNodes.push(node)
            })

            // Send response with unique nodes and edges
            res.status(200).json({ nodes: uniqueNodes, edges: uniqueEdges, msg: "200 Ok" });
        } catch (error) {
            console.error(error);
            res.status(202).json({ msg: error.message })
        }
    });


module.exports = router