/* eslint-disable no-underscore-dangle */
// Modules
const express = require('express');
// Auth
const auth = require('../middlewares/auth');
// Controllers
const userControllers = require('../controllers/userControllers');

const router = express.Router();

// Gets user profile
router.get('/:nickname', auth.viewAuth, userControllers.getUser);

module.exports = router;
