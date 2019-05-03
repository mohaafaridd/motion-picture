const express = require('express');
const listsController = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

// Add list page
router.get('/add', auth, listsController.getAddList);

// Creates new list
router.post('/', auth, listsController.postList);

// Delete a list
router.post('/delete/:id', auth, listsController.deleteList);

// Gets top movies page
router.get('/top', listsController.getTopMovies);

module.exports = router;
