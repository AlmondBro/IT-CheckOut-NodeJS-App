var express = require('express');
var router = express.Router();

var itemController = require("../controllers/itemController.js");

/* GET home page. */
router.get('/', itemController.item_list);

/* GET home page. 
    router.get('/', function(req, res, next) {
    res.render('it-checkout', { user: 'Express' });
});*/

router.post('/', itemController.item_create_post);

/* Test to see if route works
router.post('/', function(req, res, next) {
    console.log("Rendering yoloman");
    res.render('it-checkout', { name: 'Yoloman' });
});  */

//Test to see if route works
router.get('/search', itemController.item_search);

router.post('/search', itemController.item_create_post);

(function(req, res, next) {
    console.log("Object ID:", req.query.objectID);
});

//router.get('/?deviceID=:itemID', itemController.item_edit);
router.get('/edit/:deviceID', itemController.item_edit_get);

router.post('/edit/:deviceID', itemController.item_edit_put);

router.get('/delete/:deviceID', itemController.item_delete_get);

router.post('/delete/:deviceID', itemController.item_delete_post);
module.exports = router;