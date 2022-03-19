const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {path: "Home"});
});

module.exports = router;


router.get('/about', function (req, res, next) {
    res.render('about', {path: 'About'})
});