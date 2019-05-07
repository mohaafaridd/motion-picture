/* eslint-disable no-underscore-dangle */
const express = require('express');
const listsController = require('../controllers/listsControllers');
const listHelper = require('../controllers/helpers/listsHelpers');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');
const List = require('../models/list');
const User = require('../models/user');

const router = express.Router();

// Gets All user lists
router.get('/:nickname/lists', viewAuth, async (req, res) => {
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
    res.render('404', error);
  }
});

// Add list page
router.get('/:nickname/lists/add', auth, async (req, res) => {
  const { nickname } = req.params;
  const { cachedUser } = req;
  try {
    const searchedUser = await User.findOne({ nickname });

    if (!searchedUser) {
      throw new Error('No user is found with this nickname');
    }

    if (cachedUser._id.toString() !== searchedUser._id.toString()) {
      throw new Error("You can't access this user");
    }

    res.render('lists/add', { cachedUser, searchedUser });
  } catch (error) {
    res.render('404', { error });
  }
});

// Adds a list to user
router.post('/:nickname/lists/add', auth, async (req, res) => {
  const { nickname } = req.params;
  const { cachedUser } = req;

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

    res.redirect(`/users/${nickname}/`);
  } catch (error) {
    res.render('404', { error });
    // res.send('failed');
  }
});

// Creates new list
router.get('/:nickname/lists/edit/:id', auth, async (req, res) => {
  // List id
  const { id } = req.params;

  // User that tries to access this route
  const { cachedUser } = req;
  const { nickname } = req.params;

  try {
    const searchedUser = await User.findOne({ nickname });


    if (!searchedUser || searchedUser._id.toString() !== cachedUser._id.toString()) {
      throw new Error('You can edit only your lists');
    }

    // List that is trying to access
    const list = await List.findOne({ id });

    if (!list) {
      throw new Error('No list is found');
    }

    res.render('lists/edit', { list, cachedUser, searchedUser });
  } catch (error) {
    res.render('404', { error });
  }
});

router.post('/:nickname/lists/edit/:id', auth, async (req, res) => {
  const { nickname } = req.params;
  try {
    const searchedUser = await User.findOne({ nickname });
    const { cachedUser } = req;

    if (!searchedUser || searchedUser._id.toString() !== cachedUser._id.toString()) {
      throw new Error('You can edit only your lists');
    }

    const { id } = req.params;
    const { publicIndicator } = req.body;
    await List.findOneAndUpdate(
      { id: parseInt(id, 10) },
      { ...req.body, public: !!publicIndicator },
    );
    res.redirect(`/users/${nickname}/lists`);
  } catch (error) {
    res.render('404', { error });
  }
});

// Delete a list
router.post('/delete/:id', auth, listsController.deleteList);

module.exports = router;
