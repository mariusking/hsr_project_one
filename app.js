const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/note');

const app = express();

app.use(bodyParser.json());

// serve static
app.use(express.static(__dirname + '/static'));
app.use('/libraries', express.static('node_modules'));

// serve routes
routes(app);

app.use((err, req, res) => {
    res.status(422).send({error: err.message});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
