const express = require('express');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();

/* GET home page. */
router.get('/', viewAuth, (req, res) => {
  res.render('index', { title: 'Express', name: req.user.name });
});

module.exports = router;
