/* eslint-disable no-underscore-dangle */
const express = require('express');
const userControllers = require('../controllers/userControllers');
const auth = require('../middlewares/auth');
const User = require('../models/user');

const router = express.Router();

/* Sign up a user. */
router.post('/signup', userControllers.signup);

/* Sign in a user */
router.post('/signin', userControllers.signin);

/* Sign out */
router.post('/signout', auth, userControllers.signout);

router.get('/me/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await user.populate('favorite').execPopulate();
    res.send(user.favorite);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
