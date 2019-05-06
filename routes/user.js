/* eslint-disable no-underscore-dangle */
const express = require('express');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');
const logAuth = require('../middlewares/logAuth');
const userControllers = require('../controllers/userControllers');
const listsController = require('../controllers/listsControllers');


const router = express.Router();

// Sign in page
router.get('/signin', logAuth, userControllers.getSigninPage);

// Sign in a user
router.post('/signin', logAuth, userControllers.postSignin);

// Sign out
router.post('/signout', auth, userControllers.postSignout);

// Gets user profile
router.get('/:nickname', viewAuth, userControllers.getUser);

// Get a specific list
router.get('/:nickname/lists/:id', viewAuth, listsController.getList);


module.exports = router;
