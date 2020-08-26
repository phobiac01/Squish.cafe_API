const logger = require('./functions.js').logger;
const generateNewShort = require('./functions.js').generateNewShort;
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
var cors = require('cors');
const app = express();
const port = 4040;


app.use(express.json("type", "application/json"));
app.use(cors());


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

app.get('/cleanDb', (req, res) => {
    Squish.remove({}, () => {});
    User.remove({}, () => {});

    logger("!! Database cleared via REST path");
    res.send("success");
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

// > requires api key and squish SHORT via url path (unless from same origin)
// < returns squish object and success information
app.get('/squish/*', async (req, res) => {
    var targetSquish = req.path.substring(8, req.path.length +1);
    var squishResult = await Squish.findOne({short : targetSquish});

    res.json(squishResult);
    logger("> GET request from " + req.path);
});

// > requires api key and user displayName via url path
// < returns user object and success information
app.get('/user/*', async (req, res) => {
    var targetUser = req.path.substring(6, req.path.length +1);
    var userResult = await User.findOne({displayName : targetUser});
    
    res.json(userResult);
    logger("> GET request from " + req.path);
});


// API POST HANDLING
/*========================================================================================*/

app.post('/setUser', (req, res) => {
    var incomingUser = req.body;
    if(!incomingUser.displayName) {
        res.status(400).json({memo: "No displayName provided"});

    } else {
        var newUser = new User({
            displayName : incomingUser.displayName,
            avatarUrl: "https://f0.pngfuel.com/png/340/956/profile-user-icon-png-clip-art-thumbnail.png",
            created : Date(),
        });

        newUser.save((err) => {
            if (err) return handleError(err);
            console.log(newUser.displayName + " saved to DB!");
        });

        res.send(newUser);
    }
});


app.post('/setSquish', async (req, res) => {
    var incomingSquish = req.body;

    if (!incomingSquish.url) {
        res.status(400).json({memo: "No url provided"});

    } else {
        var newSquish = new Squish({
            short: (incomingSquish.short) ? incomingSquish.short : await generateNewShort(),
            long: incomingSquish.url, 
            type: "link", 
            created: new Date(),
        });

        newSquish.save((err) => {
            if (err) console.log(err);
            console.log(newSquish.short + " saved to DB!");
        });

        res.send(newSquish);
    }
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
> For user auth and editing use cookies and keys and cors
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
    avatarUrl: String, // Link to default resource in mongodb
    userLevel: 0,
    api: {hasKey: false, key: String},
    links: {total: 0, shorts: []},
});

// Models
/*=====================================================================*/

var Squish = mongoose.model('Squish', squishSchema);
var User = mongoose.model('User', userSchema);