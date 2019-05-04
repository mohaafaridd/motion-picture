/* eslint-disable no-underscore-dangle */
const express = require('express');
const viewAuth = require('../middlewares/viewAuth');
const indexController = require('../controllers/indexController');

const router = express.Router();

// Gets home
router.get('/', viewAuth, indexController.getHome);

module.exports = router;
