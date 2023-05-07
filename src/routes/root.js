const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile("../../index.html");

});

module.exports = router;

