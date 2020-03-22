const express = require('express');
const router = express.Router();
const config = require('../config')

const  Pusher = require('pusher');

router.get('/', (req, res) =>{
    res.send('Acess poll');
});

router.post('/', (req, res) =>{

    const pusherConfig = config.pusherConfig;

    var pusher = new Pusher({...pusherConfig});

    pusher.trigger('os-poll', 'os-vote', {
        points: 1,
        os: req.body.os
    });

    return res.json({sucess: true, osVoted: req.body.os});
})

module.exports = router;