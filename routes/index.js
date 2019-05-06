/* eslint-disable no-underscore-dangle */
const express = require('express');
const viewAuth = require('../middlewares/viewAuth');
const logAuth = require('../middlewares/logAuth');
const indexController = require('../controllers/indexController');

const router = express.Router();

// Gets home
router.get('/', viewAuth, indexController.getHome);

router.get('/register', logAuth, indexController.getRegister);

router.post('/register', logAuth, indexController.postRegister);

module.exports = router;
