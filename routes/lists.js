const express = require('express');
const listsController = require('../controllers/listsControllers');

const router = express.Router();

router.get('/top', listsController.getTopMovies);

module.exports = router;
