// Modules
const express = require('express');
// Auth
const auth = require('../middlewares/auth');
// Controller
const actorController = require('../controllers/actorController');

const router = express.Router();

// Gets an actor
router.get('/:id', auth.viewAuth, actorController.getActor);

module.exports = router;
