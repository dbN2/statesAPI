const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
    res.send('<html><body><h1>Hello, world!</h1></body></html>');
  });

module.exports = router;

