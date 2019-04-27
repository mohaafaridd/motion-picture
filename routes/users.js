const express = require('express');
const userControllers = require('./controllers/userControllers');

const router = express.Router();

/* Sign up a user. */
router.post('/signup', userControllers.signup);

module.exports = router;
