/* eslint-disable no-underscore-dangle */
const express = require('express');
const listController = require('../controllers/listController');

const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();

// Add list page
router.get('/:nickname/lists/add', auth, listController.getAddList);

// Adds a list to user
router.post('/:nickname/lists/add', auth, listController.postAddList);

// Edit list page
router.get('/:nickname/lists/edit/:id', auth, listController.getEditList);

// Edits a list
router.post('/:nickname/lists/edit/:id', auth, listController.postEditList);

// Delete a list
router.post('/:nickname/lists/delete/:id', auth, listController.deleteList);

// Gets specific list content
router.get('/:nickname/lists/:id', viewAuth, listController.getList);

module.exports = router;
