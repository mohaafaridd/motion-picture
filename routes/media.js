const express = require('express');
const searchController = require('../controllers/searchController');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/search', searchController);

router.get('/:type/:id', viewController);

module.exports = router;
