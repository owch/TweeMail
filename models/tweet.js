/**
 * Created by owenchen on 16-01-02.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    tw_id: String,
    text: String,
    date: Date,
    username: String,
    screenname: String

});


var Tweet = mongoose.model('Tweet', userSchema);

module.exports = Tweet;
