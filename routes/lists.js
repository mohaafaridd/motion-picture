/* eslint-disable no-underscore-dangle */
// Modules
const express = require('express');
// Auth
const auth = require('../middlewares/auth');
// Controllers
const listController = require('../controllers/listController');

const router = express.Router();

// Add list page
router.get('/:nickname/lists/add', auth.loggedAuth, listController.getAddList);

// Adds a list to user
router.post('/:nickname/lists/add', auth.loggedAuth, listController.postAddList);

// Edit list page
router.get('/:nickname/lists/edit/:id', auth.loggedAuth, listController.getEditList);

// Edits a list
router.post('/:nickname/lists/edit/:id', auth.loggedAuth, listController.postEditList);

// Delete a list
router.post('/:nickname/lists/delete/:id', auth.loggedAuth, listController.deleteList);

// Gets specific list content
router.get('/:nickname/lists/:id', auth.viewAuth, listController.getList);

module.exports = router;
