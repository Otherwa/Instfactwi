const express = require('express')
const router = express.Router()
const { get } = require('request-promise');
const { InstaloginSession, EntityFactory } = require('../middleware/loginsession');
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
        let username_stack = []
        const ig = req.ig;

        try {

            let nodes = []
            let edges = []
            const user = await ig.user.searchExact(req.body.name);
            const userId = user.pk;

            let followers = await ig.feed.accountFollowers(userId).request();
            let following = await ig.feed.accountFollowing(userId).request();


            // const followersArray = [...followers];
            // const followingArray = [...following];

            followers.users.forEach((follower) => {
                const id = follower.pk;
                const label = follower.username;
                nodes.push({ 'id': id, 'label': label });
                edges.push({ 'from': id, 'to': userId });
            });

            following.users.forEach((follow) => {
                const id = follow.pk;
                const label = follow.username;
                nodes.push({ 'id': id, 'label': label });
                edges.push({ 'from': id, 'to': userId });
            });

            console.log(nodes)
            console.log(edges)

            // res.json(followers);
            res.status(200).json({ nodes: nodes, edges: edges });

        } catch (error) {
            if (error) {
                console.log('User not found');
            } else {
                console.error(error);
            }
        }
        console.log(username_stack);

    })

module.exports = router