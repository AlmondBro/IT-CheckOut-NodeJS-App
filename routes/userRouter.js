var express = require('express');
var router = express.Router();
var paginate = require('express-paginate');

/* GET users listing. 
router.get('/users', function(req, res, next) {
    res.render('it-checkout', { user: 'Express' });
}); */


/* GET users listing. */
router.get('/users', function(req, res, next) {
    res.render('it-checkout', { user: 'Express' });
});

module.exports = router;