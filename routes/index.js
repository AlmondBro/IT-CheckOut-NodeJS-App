var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res, next) {
    res.render('it-checkout', { user: 'Express' });
});*/


//Path to avatar:
// C:\Users\lopezj\AppData\Local\Temp\CENTINELA+lopezj
router.get('/', function(req, res, next) {
    res.redirect('/items');
});

module.exports = router;