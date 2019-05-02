/* eslint-disable no-underscore-dangle */
const express = require('express');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');
const userControllers = require('../controllers/userControllers');
const listsController = require('../controllers/listsControllers');

const router = express.Router();

// Sign up page
router.get('/signup', userControllers.getSignupPage);

// Sign up a user.
router.post('/signup', userControllers.postSignup);

// Sign in page
router.get('/signin', userControllers.getSigninPage);

// Sign in a user
router.post('/signin', userControllers.postSignin);

// Sign out
router.post('/signout', auth, userControllers.postSignout);

// Gets all lists
router.get('/:nickname/lists/', viewAuth, listsController.getLists);

// Get a specific list
router.get('/:nickname/lists/:id', viewAuth, listsController.getList);


module.exports = router;
