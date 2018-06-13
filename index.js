const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser');

const routes = require('./server/routes/note');

const app = express();


app.use(morgan('tiny'));
app.use(bodyParser.json());

// serve static
app.use(express.static(`${__dirname}/public`));
app.use('/libraries', express.static('node_modules'));

// serve routes
app.use(routes);

app.use((req, res, next) => {
    res.status(404).sendfile('./public/error.html');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
