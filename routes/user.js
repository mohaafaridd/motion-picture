/* eslint-disable no-underscore-dangle */
const express = require('express');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');
const userControllers = require('../controllers/userControllers');
const listsController = require('../controllers/listsControllers');


const router = express.Router();

// Gets user profile
router.get('/:nickname', viewAuth, userControllers.getUser);

// Get a specific list
router.get('/:nickname/lists/:id', viewAuth, listsController.getList);


module.exports = router;
