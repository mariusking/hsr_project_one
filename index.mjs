import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import routes from './routes/note.mjs';

const app = express();
const port = 3000;


app.use(morgan('tiny'));
app.use(bodyParser.json());

// serve static
app.use(express.static(`public`));
app.use('/libraries/moment', express.static('node_modules/moment/min'));
app.use('/libraries/handlebars', express.static('node_modules/handlebars/dist'));

// serve routes
app.use(routes);

app.use((req, res, next) => {
    res.status(404).sendfile('./public/error.html');
});

app.use((err, req, res, next) => {
    res.status(500).send('Something broke!')
});

app.listen(port, () => console.log(`NoteApp is served under http://127.0.0.1:${port}`));
