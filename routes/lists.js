/* eslint-disable no-underscore-dangle */
const express = require('express');
const listsController = require('../controllers/listsControllers');
const listHelper = require('../controllers/helpers/listsHelpers');
const auth = require('../middlewares/auth');
const List = require('../models/list');
const User = require('../models/user');

const router = express.Router();

// Gets All user lists
router.get('/:nickname/lists', async (req, res) => {
  const { nickname } = req.params;
  const { cachedUser } = req;

  try {
    // Makes sure there is a user with the passed nickname
    const searchedUser = await User.findOne({ nickname });

    // Makes sure there's is a user with that nickname
    if (!searchedUser) {
      throw new Error('No user with this nickname is found');
    }

    const listJSON = await listHelper.getListJSON(cachedUser, searchedUser);

    res.send(listJSON);
  } catch (error) {
    res.render('404');
  }
});

// Add list page
router.get('/:nickname/lists/add', auth, async (req, res) => {
  const { nickname } = req.params;
  const { user: cachedUser } = req;
  try {
    const searchedUser = await User.findOne({ nickname });

    if (!searchedUser) {
      throw new Error('No user is found with this nickname');
    }

    if (cachedUser._id.toString() !== searchedUser._id.toString()) {
      throw new Error("You can't access this user");
    }

    res.render('lists/add', { user: searchedUser });
  } catch (error) {
    res.render('404', { error });
  }
});

router.post('/:nickname/lists/add', auth, async (req, res) => {
  const { nickname } = req.params;
  const { user: cachedUser } = req;

  try {
    const searchedUser = await User.findOne({ nickname });

    if (!searchedUser) {
      throw new Error('No user is found with this nickname');
    }

    if (cachedUser._id.toString() !== searchedUser._id.toString()) {
      throw new Error("You can't access this user");
    }

    const { publicIndicator } = req.body;
    const list = new List({
      ...req.body,
      public: !!publicIndicator,
      owner: searchedUser._id,
    });

    await list.save();

    res.redirect(`/users/${nickname}/lists/`);
  } catch (error) {
    res.send('failed');
  }
});

// Creates new list
// router.post('/', auth, listsController.postList);

router.get('/edit/:id/', auth, async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const list = await List.findOne({ id });
  res.render('lists/edit', { list, user });
});

router.post('/edit/:id', auth, async (req, res) => {
  const { newName } = req.body;
  const { id } = req.params;
  const list = await List.findOne({ id });
  const user = await User.findById(list.owner);
  try {
    const duplicate = await List.findOne({ name: newName });
    if (duplicate) {
      throw new Error();
    }

    list.name = newName;
    await list.save();
    // res.send({ list, user });
    res.redirect(`/users/${user.nickname}/lists/${list.id}`);
  } catch (error) {
    res.redirect(`/users/${user.nickname}/lists/`);
  }
});

// Delete a list
router.post('/delete/:id', auth, listsController.deleteList);

module.exports = router;
