/* eslint-disable no-underscore-dangle */
const express = require('express');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');
const logAuth = require('../middlewares/logAuth');
const userControllers = require('../controllers/userControllers');
const listsController = require('../controllers/listsControllers');
const User = require('../models/user');

const router = express.Router();

// Sign up page
router.get('/signup', logAuth, userControllers.getSignupPage);

// Sign up a user.
router.post('/signup', logAuth, userControllers.postSignup);

// Sign in page
router.get('/signin', logAuth, userControllers.getSigninPage);

// Sign in a user
router.post('/signin', logAuth, userControllers.postSignin);

// Sign out
router.post('/signout', auth, userControllers.postSignout);

// Gets user profile
router.get('/:nickname', viewAuth, async (req, res) => {
  const { nickname } = req.params;
  const profile = await User.findOne({ nickname });
  const { user } = req;
  res.render('user/profile', { profile, user });
});

// Gets all lists
router.get('/:nickname/lists/', viewAuth, listsController.getLists);

// Get a specific list
router.get('/:nickname/lists/:id', viewAuth, listsController.getList);


module.exports = router;
