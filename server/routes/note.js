const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/api', () => {});

router.post('/api/notes', noteController.create);
router.put('/api/notes/:id', noteController.update);
router.delete('/api/notes/:id', noteController.delete);
router.get('/api/notes/', noteController.all);
router.get('/api/notes/:id', noteController.get);

module.exports = router;
