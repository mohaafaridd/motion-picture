/* eslint-disable no-underscore-dangle */
// Models
const User = require('../models/user');
const List = require('../models/list');
const Media = require('../models/media');

// Helpers
const mediaInfoGrapper = require('./helpers/mediaInfoGrapper');

// Opens add a list page
const getAddList = async (req, res) => {
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
};

// Posts a list to DB
const postAddList = async (req, res) => {
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
};

// Opens edit a list page
const getEditList = async (req, res) => {
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
};

// Posts an edited list to DB
const postEditList = async (req, res) => {
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
};

// Deletes an entire list with all linked media
const deleteList = async (req, res) => {
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
};

// Returns a specific list
const getList = async (req, res) => {
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

    let output = listContent.length > 0 ? await mediaInfoGrapper(listContent) : [];

    // Seen list
    const seenList = cachedUser.seen.map(e => parseInt(e.id, 10));
    // output + seen for each media
    output = output.map((media) => {
      const mediaId = parseInt(media.id, 10);
      const seenInList = seenList.includes(mediaId);
      return { ...media, seen: seenInList };
    });

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
};

module.exports = {
  getAddList,
  postAddList,
  getEditList,
  postEditList,
  deleteList,
  getList,
};
