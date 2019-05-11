/* eslint-disable no-underscore-dangle */
const axios = require('axios');
const express = require('express');
const _ = require('lodash');

const listHelper = require('../controllers/helpers/listsHelpers');
const viewHelper = require('../controllers/helpers/viewHelpers');
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
    res.render('404', error);
  }
});

// Add list page
router.get('/:nickname/lists/add', auth, async (req, res) => {
  console.log('object');
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
    res.render('404', { error });
  }
});

// Edits a list
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
    res.redirect(`/users/${nickname}/`);
  } catch (error) {
    res.render('404', { error });
  }
});

// Delete a list
router.post('/:nickname/lists/delete/:id', auth, async (req, res) => {
  const { nickname, id } = req.params;
  try {
    const searchedUser = await User.findOne({ nickname });
    const { cachedUser } = req;

    if (!searchedUser || searchedUser._id.toString() !== cachedUser._id.toString()) {
      throw new Error('You can edit only your lists');
    }

    const list = await List.findOneAndDelete({ id });
    await Media.deleteMany({ owner: list._id });

    res.redirect(`/users/${nickname}/`);
  } catch (error) {
    res.send(error);
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

    let listContent = list.content;

    const output = await mediaInfoGrapper(listContent, false);

    res.send(output);
    // // getSimpleInfo(listContent);

    // // #1
    // listContent = listContent.map(e => ({
    //   type: e.type,
    //   id: parseInt(e.id, 10),
    // }));

    // // #2
    // const requests = listContent.map(media => axios.get(`https://api.themoviedb.org/3/${media.type}/${media.id}?api_key=${process.env.TMDB_API_KEY}`));

    // // #3
    // const response = await Promise.all(requests);

    // // #4
    // let mappedResponse = response.map(obj => (_.pick(obj.data, [
    //   'id',
    //   'vote_average',
    //   'title',
    //   'original_name',
    //   'poster_path',
    //   'overview',
    // ])));

    // // #5
    // mappedResponse = mappedResponse.map(obj => _.mapKeys(obj, (val, key) => {
    //   switch (key) {
    //     case 'original_name':
    //       return 'title';

    //     case 'vote_average':
    //       return 'votes';

    //     case 'poster_path':
    //       return 'poster';

    //     default:
    //       return key;
    //   }
    // }));

    // // #6
    // const mergedList = _.map(listContent, item => (
    //   _.assignIn(item, _.find(mappedResponse, { id: item.id }))
    // ));

    // res.render('lists/list', {
    //   searchedUser,
    //   list,
    //   isOwner,
    //   content: mergedList,
    //   cachedUser,
    // });
    // res.send(mergedList);
    // res.send(response[0].data);
  } catch (error) {
    res.render('404', { error });
  }
});

module.exports = router;
