const express = require('express');
const userControllers = require('../controllers/userControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

/* Sign up a user. */
router.post('/signup', userControllers.signup);

/* Sign in a user */
router.post('/signin', userControllers.signin);

/* Sign out */
router.post('/signout', auth, userControllers.signout);

module.exports = router;
