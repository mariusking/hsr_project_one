const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./server/routes/note');

const index = express();

index.use(bodyParser.json());

// serve routes
index.use(routes);

// serve static
index.use(express.static(__dirname + '/public'));
index.use('/libraries', express.static('node_modules'));

index.listen(3000, () => console.log('Example app listening on port 3000!'));
