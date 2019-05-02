const express = require('express');
const listsController = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');
const List = require('../models/list');

const router = express.Router();

// Creates new list
router.post('/', auth, async (req, res) => {
  const list = new List({
    ...req.body,
    owner: req.user._id,
  });

  await list.save();

  res.send(list);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const list = await List.findOne({ _id: id });
  await list.populate('content').execPopulate();
  res.send(list.content);
});


router.get('/top', listsController.getTopMovies);

module.exports = router;
