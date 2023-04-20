const express = require('express')
const router = express.Router()
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const { InstaloginSession } = require('../middleware/loginsession');

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

module.exports = router