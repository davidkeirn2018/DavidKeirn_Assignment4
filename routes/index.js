var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});
router.get('/list', function(req, res) {
    res.render('list');
});

router.get('/note', function(req, res) {
    res.render('note');
});

router.get('/note-form', function(req, res) {
    res.render('note-form');
});

module.exports = router;