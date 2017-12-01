const os = require('os');
const async = require('async');
var paginate = require('express-paginate');

var Item = require('../models/item.js');

var userOS = os.userInfo();
var usernameOS = userOS.username;

// Display list of all items
/* 
exports.item_list = function(req, res) {
    res.send('NOT IMPLEMENTED: item list');
}; */

module.exports.item_list = function(req, res) {
    async.parallel({
            item_list: function(callback) {
                //Found out about result coming out weird through here:
                //Item.find({ category: 'iPad', manufacturer: 'Zoovu' }, callback);

                /* paginate.middleware(limit, maxLimit) in app.use validates and supplies default 
                values to req.skip (an alias of req.offset which can be used to skip or offset a number
                of records for pagination). With mongoose, you do Model.find().skip(req.skip) */
                //Item.find({ location: 'Hawthorne' }, null, { location: 'Hawthorne' }).exec(callback);
                Item.find({}, callback).skip(req.skip); //.sort({ date: 'desc' });
                //-  Item.find({}).sort('date').skip(req.skip).exec(callback); //skip method wasn't here before, doing for paginate
            }, //end item_list
        }, //end object passed to async.parallel()
        function(err, results) {
            Item.paginate({}, { page: req.query.page, limit: req.query.limit },
                function(err, items, pageCount, itemCount) {
                    if (err) return next(err);

                    res.format({
                        html: function() {
                            res.render('it-checkout', {
                                data: items.docs,
                                pageCount: items.pages,
                                itemCount: items.total,
                                pages: paginate.getArrayPages(req)(3, items.pages, req.query.page),
                                //pages: res.locals.paginate.getArrayPages(5, items.pages, 1),
                                error: err,
                                sampleMessage: "Salve Munde",
                                usernameOS: usernameOS
                                    //data: results.item_list
                            });
                        }, //end html method that returns a function
                        json: function() {
                                res.json({
                                    object: 'list',
                                    //has_more: paginate.hasNextPages(req)(5),
                                    has_more: res.locals.paginate.hasNextPages(items.pages),
                                    data: items.docs
                                }); //end res.json() 
                            } //end json method that returns a function
                    });
                    console.log("100th element information: ", "\n", items.docs[99]);

                    console.log("Number of pages:", items.pages);
                    console.log("Number of items:", items.total);
                } //end anonymous function
            );
            //Results was returning an object with a property called items_list, whose value was the actual array of JSON objects
            //var yolo = Array.isArray(results);
            /* 
            var yolo = Array.isArray(results);
             res.render('it-checkout', { name: currentUserName, error: err, data: results.item_list });
             //console.log(results);
             console.log(results);
             console.log("Typeof results", typeof results);
             console.log("Is results an array:", yolo);
             console.log("Results is an array: ", results instanceof Array);
             console.log(results.item_list[0].model); 
             */
            // console.log(results.category[3]);
        } //end function(err, results)
    ); //end async.parallel() function
}; //end item list funtion(req, res)

// Handle item create on POST
module.exports.item_create_post = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: item create POST');
    console.log("item_create_post() function called");
    req.checkBody('serialNumber_field', 'A serial number must be provided to add a device').notEmpty();

    //Sanitize fields by escaping all fields first then trimming
    //Escape fields
    console.log("Escaping fields...");
    req.sanitize('manufacturer_field').escape();
    req.sanitize('model_field').escape();
    req.sanitize('condition_field').escape();
    req.sanitize('purchasePrice_field').escape();
    req.sanitize('currentValue_field').escape();
    req.sanitize('serialNumber_field').escape();

    //Trim fields
    console.log("Trimming fields...");
    req.sanitize('manufacturer_field').trim();
    req.sanitize('model_field').trim();
    req.sanitize('condition_field').trim();
    req.sanitize('purchasePrice_field').trim();
    req.sanitize('currentValue_field').trim();
    req.sanitize('serialNumber_field').trim();

    var errors = req.validationErrors();

    console.log("Initializing new item...");
    var item = new Item({
        category: req.body.category_dropdown,
        manufacturer: req.body.manufacturer_field,
        model: req.body.model_field,
        condition: req.body.condition_field,
        location: req.body.locationDropdown,
        purchase_price: req.body.purchasePrice_field,
        current_value: req.body.currentValue_field,
        acquired_date: req.body.date_field,
        serial_number: req.body.serialNumber_field
    }); // end new Item invocation
    console.log("Finished initializing new item");

    console.log("\nCategory: ", req.body.category_dropdown);
    console.log("Manufacturer: ", req.body.manufacturer_field);
    console.log("Model: ", req.body.model_field);
    console.log("Condition: ", req.body.condition_field);
    console.log("Location: ", req.body.locationDropdown);
    console.log("Purchase Price: ", req.body.purchasePrice_field);
    console.log("Current Value: ", req.body.currentValue_field);
    console.log("Acquired Date: ", req.body.date_field);
    //Date = new Date(Date.parse("March 21, 2012"))
    console.log("Serial Number: ", req.body.serialNumber_field);


    /*if (errors) {
        res.render('it-checkout', {
            item: item,
            error: errors
        }); //end res.render() method
        console.error("Errors have occurred in attempting to add an item \n" + errors + errors.status + "\n" + errors.stack);
        return;
    } //end if-statement
    else {*/ //If data from form is valid, save the new item to the database
    item.save(function(err) {
        if (err) {
            return next(err); //Pass error to next middleware
        } //end if-statement
        console.log("New item added! The item.save() function worked :)\n");
        res.redirect("/items");
    }); //end save function
    // } //end else statement

}; // end item_create_post() function


// Handle item update on POST
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};

module.exports.item_search = function(req, res, next) {
    //Item.find({}, callback).skip(req.skip); / / .sort({ date: 'desc' });
    //res.send("Search function not implemented yet");
    console.log("item_create_post() function called");
    req.checkBody('ISBN_field', 'A serial number must be provided to search for a device').notEmpty();
    req.checkBody('technology_dropdown', 'Technology dropdown  must not be empty').notEmpty();
    req.checkBody('location_dropdown', 'location_dropdown must not be empty').notEmpty();

    //Sanitize fields by escaping all fields first then trimming
    //Escape fields
    console.log("Escaping fields...");
    req.sanitize('ISBN_field').escape();
    req.sanitize('technology_dropdown').escape();
    req.sanitize('location_dropdown').escape();

    //Trim fields
    console.log("Trimming fields...");
    req.sanitize('ISBN_field').trim();
    req.sanitize('technology_dropdown').trim();
    req.sanitize('location_dropdown').trim();

    var errors = req.validationErrors();

    /*
    if (errors) {
        console.log(errors);
        console.log("Req.body: ", JSON.stringify(req.body));
        console.log("Req.query: ", JSON.stringify(req.query));
        console.log("Serial Number: ", req.body.ISBN_field);
        console.log("Serial Number params: ", req.params.ISBN_field);
        console.log("Serial Number query: ", req.query.ISBN_field);
    } //end if-statement */

    Item.findOne({
        serial_number: req.query.ISBN_field
    }, function(err, item) {
        console.log("Type of item:", typeof item);
        console.log("Item contents: ", item);
        console.log("req.query.ISBN_field: ", req.query.ISBN_field);
        console.log("Type of req.body.ISBN_field: ", typeof req.body.ISBN_field);
        console.log("req.body.ISBN_field: ", req.body.ISBN_field);

        var itemArray = [];
        itemArray.push(item);

        console.log("itemArray type:", typeof itemArray);
        console.log("itemArray contents:", itemArray);
        res.render('it-checkout', {
            data: itemArray,
            ISBN: req.query.ISBN_field,
            deviceID: req.query.deviceID,
            err: err,
            pageCount: 1,
            usernameOS: usernameOS
        });
    }).skip(req.skip); // end findOne() function
}; //end item_search function

module.exports.item_edit_get = function(req, res, next) {
    console.log("req.params.deviceID: ", req.params.deviceID);

    Item.findOne({
        _id: req.params.deviceID
    }, function(err, item) {
        console.log("Type of item:", typeof item);
        console.log("Item contents: ", item);
        console.log("req.query.ISBN_field: ", req.query.ISBN_field);
        console.log("Type of req.body.ISBN_field: ", typeof req.body.ISBN_field);
        console.log("req.body.ISBN_field: ", req.body.ISBN_field);

        var itemArray = [];
        itemArray.push(item);

        console.log("itemArray type:", typeof itemArray);
        console.log("itemArray contents:", itemArray);
        res.render('it-checkout', {
            data: itemArray,
            ISBN: req.query.ISBN_field,
            deviceID: req.query.deviceID,
            err: err,
            pageCount: 1,
            usernameOS: usernameOS
        });
    }).skip(req.skip); // end findOne() function
}

module.exports.item_edit_put = function(req, res, next) {
    //res.send('item_edit_put');
    console.log('\nitem_edit_put()');

    req.checkBody('serial_number_field', 'A serial number must be provided to add a device').notEmpty();

    console.log("Escaping fields...");
    req.sanitize('manufacturer_field').escape();
    req.sanitize('model_field').escape();
    req.sanitize('condition_field').escape();
    req.sanitize('purchase_price_field').escape();
    req.sanitize('currentValue_field').escape();
    req.sanitize('serial_number_field').escape();

    console.log("Trimming fields...");
    req.sanitize('manufacturer_field').trim();
    req.sanitize('model_field').trim();
    req.sanitize('condition_field').trim();
    req.sanitize('purchase_price_field').trim();
    req.sanitize('currentValue_field').trim();
    req.sanitize('serial_number_field').trim();

    var errors = req.validationErrors();

    console.log("Initializing old item...");
    var itemUpdated = new Item({
        category: req.body.category_dropdown,
        manufacturer: req.body.manufacturer_field,
        model: req.body.model_field,
        condition: req.body.condition_field,
        location: req.body.location_dropdown,
        purchase_price: req.body.purchase_price_field,
        current_value: req.body.currentValue_field,
        acquired_date: req.body.date_field,
        serial_number: req.body.serial_number_field,
        _id: req.params.deviceID //This is required, or a new ID will be assigned!
    }); // end new Item invocation
    console.log("Finished initializing old item");

    // if (errors) {
    console.log("\Errors:", errors);
    //} else {
    // Data from form is valid. Update the record.
    Item.findByIdAndUpdate(req.params.deviceID, itemUpdated, { new: true }, function(err, itemUpdated) {
        console.log('\nFinding by id and updating...');
        if (err) { console.log('If-err', err); return next(err); }
        //successful - redirect to book detail page.
        var itemArray = [];
        itemArray.push(itemUpdated);

        //console.log("itemArray type:", typeof itemArray);
        // console.log("itemArray contents:", itemArray);
        res.render('it-checkout', {
            data: itemArray,
            ISBN: req.query.ISBN_field,
            deviceID: req.query.deviceID,
            err: err,
            pageCount: 1
        });
    });
}

module.exports.item_delete_get = function(req, res, next) {
    console.log('\nitem_delete()');

    console.log("req.params.deviceID: ", req.params.deviceID);

    Item.findOne({
        _id: req.params.deviceID
    }, function(err, item) {
        console.log("Type of item:", typeof item);
        console.log("Item contents: ", item);
        console.log("req.query.ISBN_field: ", req.query.ISBN_field);
        console.log("Type of req.body.ISBN_field: ", typeof req.body.ISBN_field);
        console.log("req.body.ISBN_field: ", req.body.ISBN_field);

        var itemArray = [];
        itemArray.push(item);

        console.log("itemArray type:", typeof itemArray);
        console.log("itemArray contents:", itemArray);
        res.render('it-checkout', {
            data: itemArray,
            ISBN: req.query.ISBN_field,
            deviceID: req.query.deviceID,
            err: err,
            pageCount: 1
        });
    }).skip(req.skip); // end findOne() function
}

module.exports.item_delete_post = function(req, res, next) {
    Item.where({ _id: req.params.deviceID }).findOneAndRemove(function(err, doc, result) {
        if (err) console.log('FindandRemove Callback Error: ', err);
        console.log('\nExecuting callback of findOneAndRemove');
        console.log('DeviceID: ', req.params.deviceID);
        res.redirect('/items');
    });
}