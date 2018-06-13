const noteController = require('../controllers/noteController');

module.exports = (app) => {
    // Watch from incoming request of method GET
    app.get('/api', () => {});

    app.post('/api/notes', noteController.create);
    app.put('/api/notes/:id', noteController.update);
    app.delete('/api/notes/:id', noteController.delete);
    app.get('/api/notes/', noteController.all);
    app.get('/api/notes/:id', noteController.get);
};
