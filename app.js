const schemas = require('./schemas.js');
const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/containerStop', (req, res) => process.exit(0));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));



// Open up remote server: copy oevr and clean up any useable code
// Mock up a psudocode schema 
// (maybe use one of the fancy new database mockup services)

// http://localhost:4200
// https://squish.cafe/AAAAA
// https://squish.cafe/api/test
// <<replace with trello link>>
// <<replace with GitHub link>>