/* eslint-disable no-underscore-dangle */
const express = require('express');
const auth = require('../middlewares/auth');
const userControllers = require('../controllers/userControllers');

const router = express.Router();

// Gets user profile
router.get('/:nickname', auth.viewAuth, userControllers.getUser);

module.exports = router;
