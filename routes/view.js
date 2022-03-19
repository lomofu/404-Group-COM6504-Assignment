const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {path: "Home"});
});

router.get('/about', function (req, res, next) {
    res.render('about', {path: 'About'})
});

router.get('/story', (req, res) => {
    res.render('story', {path: "Story"});
});

module.exports = router;