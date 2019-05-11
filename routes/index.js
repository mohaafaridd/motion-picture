/* eslint-disable no-underscore-dangle */
// Modules
const express = require('express');
const auth = require('../middlewares/auth');
const indexController = require('../controllers/indexController');

const router = express.Router();

// Gets home
router.get('/', auth.viewAuth, indexController.getHome);

// Goes to registeration page
router.get('/register', auth.anonymousAuth, indexController.getRegister);

// Add a new user to database
router.post('/register', auth.anonymousAuth, indexController.postRegister);

// Goes to log in page
router.get('/login', auth.anonymousAuth, indexController.getLogin);

// log in a user
router.post('/login', auth.anonymousAuth, indexController.postLogin);

router.post('/logout', auth.loggedAuth, indexController.postLogout);

module.exports = router;
