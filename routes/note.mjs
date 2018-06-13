import express from 'express';
import noteController from './../controllers/noteController.mjs';

const router = express.Router();

router.get('/api', () => {});

router.post('/api/notes', noteController.create);
router.put('/api/notes/:id', noteController.update);
router.delete('/api/notes/:id', noteController.remove);
router.get('/api/notes/', noteController.all);
router.get('/api/notes/:id', noteController.get);

export default router;
