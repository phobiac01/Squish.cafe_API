const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema for each db object in this file and export

var squishSchema = new Schema({
    short:  String,
    long: String,
    type: String,
    created: Date,
    lastEdited: Date,
    clicks: 0,
    ssl: Boolean,
    ownerDisplay: String,
    ownerID: String,
    sourceApiKey: String,
});

var userSchema = new Schema({
    displayName: String,
    userID: String,
    created: Date,
    lastEdited: Date,
    avatar: String, // Link to default resource in mongodb
    userLevel: 0,
    api: {hasKey: false, key: String},
    links: {total: 0, shorts: []},
});

// Models
/*=====================================================================*/

var Squish = mongoose.model('Squish', squishSchema);
var User = mongoose.model('User', userSchema);


module.exports = [ Squish , User ];


/*
> Long
> Short
> SSL
> Type :link, file, query:
> Creation Timestamp
> Last Edited Timestamp
> Owner ID
> Api Key
> Creation Domain
*/