/* eslint-disable no-underscore-dangle */
const express = require('express');
const Media = require('../models/media');
const List = require('../models/list');
const searchController = require('../controllers/searchController');
const viewController = require('../controllers/viewController');
const { addToList } = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();

router.get('/search', viewAuth, searchController);

router.get('/:type/:id', viewController);

router.post('/add-to-list', auth, addToList);

router.post('/remove-from-list', auth, async (req, res) => {
  const { listid, mediaid } = req.body;

  const list = await List.findOne({ id: listid });
  const media = await Media.findOne({ owner: list._id, id: mediaid });

  await media.remove();

  res.redirect('/');
});

module.exports = router;
