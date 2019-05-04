/* eslint-disable no-underscore-dangle */
const express = require('express');
const searchController = require('../controllers/searchController');
const viewController = require('../controllers/viewController');
const listsController = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();


router.get('/search', viewAuth, searchController);

router.get('/:type/:id', viewAuth, viewController);

router.post('/add-to-list', auth, listsController.addToList);

router.post('/remove-from-list', auth, listsController.deleteFromList);

module.exports = router;
