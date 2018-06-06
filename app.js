const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic(path.join(__dirname,'static')));

app.get('/api', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
