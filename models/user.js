// user.js
var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var User_Schema = new Schema({
        first_name: {
            type: String,
            min: [2, 'Please enter more characters for the first name'],
            max: [25, 'Do not enter more than 25 characters for your first name']
        },
        last_name: {
            type: String,
            min: [2, 'Please enter more characters for the last name'],
            max: [25, 'Do not enter more than 25 characters for your last name']
        },
        email: {
            type: String,
            min: [2, 'Please enter more characters for the last name'],
            max: [25, 'Do not enter more than 25 characters for your last name'],
            required: [true, 'An e-mail is necessary to register a user']
        },
        location: {
            type: String,
            required: [true, 'A location is necessary to register a user'],
            enum: ['District Office', 'Adult Ed', 'CVIS', 'Hawthorne', 'Leuzinger', 'Loyde', ] //comma at the end
        },
        job_title: {
            type: String,
            min: [5, 'Please enter more characters for the job title'],
            max: [25, 'Do not enter more than 25 characters for your job title']
        }
    }) //end User_Schema

// Virtual for user's full name
User_Schema
    .virtual('name')
    .get(function() {
        return this.first_name + ', ' + this.lastname;
    });

// Virtual for user's last name
User_Schema
    .virtual('url')
    .get(function() {
        return '/users/' + this._id;
    });

// Compile model from schema
var User = mongoose.model('User', User_Schema);

//Export function to create "User" model class
module.exports = User;