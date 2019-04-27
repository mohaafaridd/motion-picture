const express = require('express');
const userControllers = require('./controllers/userControllers');

const router = express.Router();

/* Sign up a user. */
router.post('/signup', userControllers.signup);

/* Sign in a user */
router.post('/signin', userControllers.signin);

module.exports = router;
