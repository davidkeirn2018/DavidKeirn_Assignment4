var express = require('express');
var router = express.Router();
var ctrlNotes = require('../controllers/notes_api');

router.get('/notes', ctrlNotes.findAll);
router.delete('/notes', ctrlNotes.deleteAll);

router.get('/users/:userId/notes', ctrlNotes.findAllUserNotes);
router.get('/users/:userId/notes/:title', ctrlNotes.findOneUserNoteByTitle);
router.post('/users/:userId/notes', ctrlNotes.addOneUserNote);
router.put('/users/:userId/notes/:title', ctrlNotes.updateOneUserNote);
router.delete('/users/:userId/notes/:title', ctrlNotes.deleteOneUserNote);

module.exports = router;
