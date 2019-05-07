/* eslint-disable no-underscore-dangle */
const express = require('express');
const viewAuth = require('../middlewares/viewAuth');
const logAuth = require('../middlewares/logAuth');
const auth = require('../middlewares/auth');
const indexController = require('../controllers/indexController');

const router = express.Router();

// Gets home
router.get('/', viewAuth, indexController.getHome);

// Goes to registeration page
router.get('/register', logAuth, indexController.getRegister);

// Add a new user to database
router.post('/register', logAuth, indexController.postRegister);

// Goes to log in page
router.get('/login', logAuth, indexController.getLogin);

// log in a user
router.post('/login', logAuth, indexController.postLogin);

router.post('/logout', auth, indexController.postLogout);

module.exports = router;
