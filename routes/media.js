/* eslint-disable no-underscore-dangle */
const express = require('express');
const searchController = require('../controllers/searchController');
const viewController = require('../controllers/viewController');
const { addToList } = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();

router.get('/search', viewAuth, searchController);

router.get('/:type/:id', viewController);

router.post('/add-to-list', auth, addToList);

module.exports = router;
