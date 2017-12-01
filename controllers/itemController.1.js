const os = require('os');
const async = require('async');

var Item = require('../models/item.js');

var userOS = os.userInfo();
var currentUserName = userOS.username;

// Display list of all items
/* 
exports.item_list = function(req, res) {
    res.send('NOT IMPLEMENTED: item list');
};

*/

module.exports.item_list = function(req, res) {
    async.parallel({
            item_list: function(callback) {
                //Found out about result coming out weird through here:
                //Item.find({ category: 'iPad', manufacturer: 'Zoovu' }, callback);
                Item.find({}, callback).skip(req.skip); //skip method wasn't here before, doing for paginate
            }, //end item_list
        }, //end object passed to async.parallel()
        function(err, results) {
            //Results was returning an object with a property called items_list, whose value was the actual array of JSON objects
            //var yolo = Array.isArray(results);
            var yolo = Array.isArray(results);
            res.render('it-checkout', { name: currentUserName, error: err, data: results.item_list });
            //console.log(results);
            console.log(results);
            console.log("Typeof results", typeof results);
            console.log("Is results an array:", yolo);
            console.log("Results is an array: ", results instanceof Array);
            console.log(results.item_list[0].model);
            // console.log(results.category[3]);
        } //end function(err, results)
    ); //end async.parallel() function
}; //end item list funtion(req, res)


// Display detail page for a specific item
exports.item_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: item detail: ' + req.params.id);
};

// Display item create form on GET
exports.item_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item create GET');
};

// Handle item create on POST
exports.item_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item create POST');
};

// Display item delete form on GET
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};

///////////////////////////////
/*
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://JuanDa95:yolo95@ds155091.mlab.com:55091/cv-it-checkout', function(err, db) {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //   _id: new ObjectID('57bb36afb3b6a3801d8c479d')
    // }).toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //   console.log(`Todos count: ${count}`);
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });

    /* db.collection('Items').find().toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }); */

/*  db.collection('Items').find({ category: "Projector" }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    });
    db.close();
}); */