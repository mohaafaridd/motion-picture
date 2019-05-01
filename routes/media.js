/* eslint-disable no-underscore-dangle */
const express = require('express');
const searchController = require('../controllers/searchController');
const viewController = require('../controllers/viewController');
const Media = require('../models/media');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/search', searchController);

router.get('/:type/:id', viewController);

router.post('/favorite', auth, async (req, res) => {
  const media = new Media({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await media.save();
    res.status(201).send(media);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
