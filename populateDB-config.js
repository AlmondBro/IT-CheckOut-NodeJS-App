var user_mockData_array = require('./user-mockData.js');

var config = {
    fields: user_mockData_array, // {array} data to import 
    db: 'name', // {string} name of db 
    collection: 'collection', // {string|function} name of collection, or use a function to 
    //  return a name, accept one param - [fields] the fields to import 

    // they're options 
    host: 'ds155091.mlab.com', // {string} [optional] by default is 27017 
    username: 'JuanDa95', // {string} [optional] 
    password: 'yolo95', // {string} [optional] 
    callback: (err, db) => {} // {function} [optional] 
};

module.exports = config;