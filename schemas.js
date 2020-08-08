var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema for each db object in this file and export

var squishSchema = new Schema({
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs:  Number,
    }
});





module.exports = [ squishSchema ];