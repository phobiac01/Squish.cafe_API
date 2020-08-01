const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/containerStop', (req, res) => process.exit(0));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));