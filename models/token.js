/**
 * Created by owenchen on 16-01-06.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    access_token: String,
    access_secret: String,
    screen_name: String,
    creation: Date
});


var token = mongoose.model('token', userSchema);

module.exports = token;