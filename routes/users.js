const express = require('express');
const userController = require('./controllers/userControllers');

const router = express.Router();

/* GET users listing. */
router.post('/signup', userController.signup);

module.exports = router;
