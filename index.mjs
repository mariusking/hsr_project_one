import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import routes from './routes/note.mjs';

const app = express();


app.use(morgan('tiny'));
app.use(bodyParser.json());

// serve static
app.use(express.static(`public`));
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
