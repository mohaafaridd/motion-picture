/* eslint-disable no-underscore-dangle */
const express = require('express');
const viewAuth = require('../middlewares/viewAuth');
const userControllers = require('../controllers/userControllers');

const router = express.Router();

// Gets user profile
router.get('/:nickname', viewAuth, userControllers.getUser);

// Get a specific list
// router.get('/:nickname/lists/:id', viewAuth, listsController.getList);


module.exports = router;
