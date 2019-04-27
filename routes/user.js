const express = require('express');
const userControllers = require('./controllers/userControllers');

const router = express.Router();

/* Sign up a user. */
router.post('/signup', userControllers.signup);
router.post('/signin', userControllers.signin);

module.exports = router;
