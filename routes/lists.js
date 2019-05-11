/* eslint-disable no-underscore-dangle */
const express = require('express');

const listHelper = require('../controllers/helpers/listsHelpers');
const mediaInfoGrapper = require('../controllers/helpers/mediaInfoGrapper');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');
const List = require('../models/list');
const User = require('../models/user');
const Media = require('../models/media');

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
    res.render('404', { error, cachedUser });
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
    res.render('404', { error, cachedUser });
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
    res.render('404', { error, cachedUser });
  }
});

// Edit list page
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
    res.render('404', { error, cachedUser });
  }
});

// Edits a list
router.post('/:nickname/lists/edit/:id', auth, async (req, res) => {
  const { nickname } = req.params;
  const { cachedUser } = req;
  try {
    const searchedUser = await User.findOne({ nickname });

    if (!searchedUser || searchedUser._id.toString() !== cachedUser._id.toString()) {
      throw new Error('You can edit only your lists');
    }

    const { id } = req.params;
    const { publicIndicator } = req.body;
    const updatedList = await List.findOneAndUpdate(
      { id: parseInt(id, 10) },
      { ...req.body, public: !!publicIndicator },
    );

    if (!updatedList) {
      throw new Error('No list is found');
    }

    res.redirect(`/users/${nickname}/`);
  } catch (error) {
    res.render('404', { error, cachedUser });
  }
});

// Delete a list
router.post('/:nickname/lists/delete/:id', auth, async (req, res) => {
  const { nickname, id } = req.params;
  const { cachedUser } = req;
  try {
    const searchedUser = await User.findOne({ nickname });

    if (!searchedUser || searchedUser._id.toString() !== cachedUser._id.toString()) {
      throw new Error('You can edit only your lists');
    }

    const list = await List.findOneAndDelete({ id });

    if (!list) {
      throw new Error('No list is found');
    }

    await Media.deleteMany({ owner: list._id });

    res.redirect(`/users/${nickname}/`);
  } catch (error) {
    res.render('404', { error, cachedUser });
  }
});

// Gets specific list content
router.get('/:nickname/lists/:id', viewAuth, async (req, res) => {
  const { nickname, id } = req.params;
  const { cachedUser } = req;

  try {
    // Makes sure there is a user with the passed nickname
    const searchedUser = await User.findOne({ nickname });

    // Makes sure there's is a user with that nickname
    if (!searchedUser) {
      throw new Error('No user with this nickname is found');
    }

    const list = await List.findOne({ id, owner: searchedUser._id });

    if (!list) {
      throw new Error('No list found');
    }

    const isOwner = list.owner.toString() === cachedUser._id.toString();

    if (!list.public && !isOwner) {
      throw new Error('No list found');
    }

    await list.populate('content').execPopulate();

    const listContent = list.content;

    const output = listContent.length > 0 ? await mediaInfoGrapper(listContent, false) : [];

    res.render('lists/list', {
      searchedUser,
      list,
      isOwner,
      content: output,
      cachedUser,
    });
  } catch (error) {
    res.render('404', { error, cachedUser });
  }
});

module.exports = router;
