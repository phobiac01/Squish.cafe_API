const logger = require('./functions.js').logger;
//const schemas = require('./schemas.js');
//var Squish = schemas.Squish;
//var User = schemas.User;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdb', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("> Database has been opened")});
db.on('close', () => {console.log("> Database has been closed")});

// const sslChecker = require('ssl-checker');
const express = require('express');
const app = express();
const port = 4040;

app.use(express.json("type", "application/json"));



app.get('/', (req, res) => {
    res.send('Please specify your query!<br>Documentation can be found at https://squish.cafe/docs');
});

app.get('/dbClose', (req, res) => {
    db.close();
    logger("!! Database closed via REST path");
    res.send("Database closed.");
});

app.get('/apiStop', (req, res) => {
    logger("!! API has been stopped via REST path");
    db.close();
    process.exit(0);
});

// API GET HANDLING
/*========================================================================================*/

// Handling unspecified route
app.get('/squish/', (req, res) => {
    res.status(404).send('Please specify a route! Like this:</br>squish.cafe/api/squish/Av94X'); // Update status of route not specified and download HTML status codes to laptop
    logger("> GET request from " + req.path + " rejected - path not specified");
});

// Handling unspecified route
app.get('/user/', (req, res) => {
    res.status(404).send('Please specify a route! Like this:</br>squish.cafe/api/user/BlueDragonDev'); // Update status of route not specified
    logger("> GET request from " + req.path + " rejected - path not specified");
});

/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/


// > requires api key and squish SHORT via url path
// < returns squish object and success information
app.get('/squish/*', (req, res) => {
    res.send("This route will try to find the squish object located at " + req.path + "</br>Not Yet Implimented!");
    logger("> GET request from " + req.path);
});

// > requires api key and user displayName via url path
// < returns user object and success information
app.get('/user/*', (req, res) => {
    res.send("This route will try to find the user object located at " + req.path + "</br>Not Yet Implimented!");
    logger("> GET request from " + req.path);
});


// API POST HANDLING
/*========================================================================================*/

app.post('/setUser', (req, res) => {
    console.log("reqBody = " + req.body.displayName); // TODO: Fix body parsing and get that working!!
    var newUser = new User({displayName : req.body.displayName});

    newUser.save((err) => {
        if (err) return handleError(err);
        console.log(newUser.displayName + " saved to DB!");
    });

    res.send(newUser);
});

app.post('/setSquish', (req, res) => {
    var newSquish = new Squish({
        short: req.body.short, 
        long: req.body.long, 
        type: "link", 
        created: new Date()
    });

    newSquish.save((err) => {
        if (err) return handleError(err);
        console.log(newSquish.displayName + " saved to DB!");
    });

    res.send(newSquish);
});

/*=========================================()===============================================*/

app.listen(port, () => console.log(`]] Squisher API listening at http://localhost:${port}`));

process.on('exit', function (){
    db.close();
    console.log('] Goodbye!');
});



// Open up remote server: copy oevr and clean up any useable code
// Mock up a psudocode schema
// (maybe use one of the fancy new database mockup services)

// http://localhost:4200
// https://squish.cafe/AAAAA
// https://squish.cafe/api/test
// <<replace with trello link>>
// <<replace with GitHub link>>


/*
Extra Notes:
> For user auth and editing use cookies and keys
    - each user has their own ID. When logging in a new auth key is added to their browser and user account
    - When doing an authed action, user ID is sent as well as auth key, checked against db, and enacted
*/







// TODO: Figure out how to have schemas in schemas.js file
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