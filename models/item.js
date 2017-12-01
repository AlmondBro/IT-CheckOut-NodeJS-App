//item.js
const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');

// Define schema
var Schema = mongoose.Schema;

var Item_Schema = new Schema({
        category: {
            type: String,
            required: [true, 'A category is necessary to register a device'],
            enum: ['DVD Drive', 'Nexus 7 Tablet', 'Docking Station', 'Ziggie Camera',
                    'Promethean Stylus', 'Promethean Slate', 'iPad', 'iPad KeyBoard',
                    'Stylus', 'Laptop', 'Speakers', 'Clickers', 'Document Camera',
                    'Projector', 'Elmo', 'Camera', 'Plasco Mobile', 'Eno-Slate',
                    'Eno-Stylus',
                ] //comma at the end
        },
        manufacturer: {
            type: String,
            max: [25, 'Do not enter more than 25 characters for the manufacturer name']
        },
        model: {
            type: String,
            max: [25, 'Do not enter more than 25 characters for the model']
        },
        condition: {
            type: String,
            max: [15, 'Do not enter more than 15 characters for the condition']
        },
        location: {
            type: String,
            required: [true, 'A location is necessary to register an item'],
            enum: ['District Office', 'Adult Ed', 'CVIS', 'Hawthorne', 'Leuzinger', 'Lloyde', ] //comma at the end inside array
        },

        purchase_price: Number,
        current_value: Number,
        acquired_date: {
            type: Date,
            default: Date.now
        },

        serial_number: {
            type: String,
            required: [true, 'A serial number is necessary to register a device'],
            max: [25, 'Do not enter more than 25 characters for the serial #']
        }
    }) //end Item_Schema

// Virtual for user's last name
Item_Schema
    .virtual('date_formatted')
    .get(function() {
        return moment(this.acquired_date).format('MM-DD-YYYY');
    });

Item_Schema.plugin(mongoosePaginate);
// Compile model from schema
var Item = mongoose.model('Item', Item_Schema);

//Export function to create "User" model class
module.exports = Item;