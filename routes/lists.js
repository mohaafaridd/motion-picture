const express = require('express');
const listsController = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/add', auth, listsController.getAddList);

// Creates new list
router.post('/', auth, listsController.postList);

router.get('/top', listsController.getTopMovies);

module.exports = router;
