/* eslint-disable no-underscore-dangle */
// Modules
const express = require('express');
// Auth
const auth = require('../middlewares/auth');
// Controllers
const mediaController = require('../controllers/mediaController');

const router = express.Router();

// Search
router.get('/search', auth.viewAuth, mediaController.search);

// Get specific movie or tv show
router.get('/:type/:id', auth.viewAuth, mediaController.view);

router.post('/add-to-list', auth.loggedAuth, mediaController.addToList);

router.post('/remove-from-list', auth.loggedAuth, mediaController.deleteFromList);

router.post('/:id/seen/', auth.loggedAuth, mediaController.seen);

module.exports = router;
