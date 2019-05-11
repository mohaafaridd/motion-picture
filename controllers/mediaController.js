/* eslint-disable no-underscore-dangle */
const Media = require('../models/media');
const List = require('../models/list');
const searchHelper = require('./helpers/searchHelpers');
const listsHelpers = require('./helpers/listsHelpers');
const mediaInfoGrapper = require('./helpers/mediaInfoGrapper');

// Adds media to list
const addToList = async (req, res) => {
  // req.body must contain owner
  try {
    req.body.owner = await List.findOne({ name: req.body.owner });
    const duplicate = await Media.findOne({
      id: req.body.id,
      owner: req.body.owner,
    });

    if (duplicate) {
      throw new Error('duplicated movie in same list');
    }
    const media = new Media(req.body);

    await media.save();
    res.status(200).redirect(`/users/${req.cachedUser.nickname}/lists/${req.body.owner.id}`);
  } catch (e) {
    res.status(400).redirect(`/users/${req.cachedUser.nickname}/lists/${req.body.owner.id}`);
  }
};

// Removes media from list
const deleteFromList = async (req, res) => {
  const { listid, mediaid } = req.body;
  try {
    const list = await List.findOne({ id: listid });
    const media = await Media.findOne({ owner: list._id, id: mediaid });
    await media.remove();
    res.redirect(`/users/${req.cachedUser.nickname}/lists/${listid}`);
  } catch (error) {
    res.redirect();
  }
};

// Search for media
const search = async (req, res) => {
  try {
    const { type, title } = req.query;
    const { cachedUser } = req;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      throw new Error('Search error');
    }

    // Get media array
    const mediaArray = await searchHelper.getMediaArray({ type, title });

    if (mediaArray.length === 0) {
      throw new Error('Search error');
    }

    // Filtered data to fit the model
    let filteredData = searchHelper.mapData(mediaArray);

    if (!cachedUser.isAnonymous) {
      const seenList = cachedUser.seen.map(obj => obj.id);
      filteredData = filteredData.map(media => ({ ...media, seen: seenList.includes(media.id) }));
    }

    const lists = cachedUser.isAnonymous
      ? [] : await listsHelpers.getListJSON(cachedUser, cachedUser);

    const hasList = lists.length !== 0;

    // res.send(filteredData);
    res.render('search/results', {
      title: 'Search Results',
      type,
      results: filteredData,
      options: lists,
      hasList,
      isLogged: !cachedUser.isAnonymous,
      cachedUser,
    });
  } catch (error) {
    res.status(400).redirect(req.header('Referer'));
  }
};

// Gets detailed media information
const view = async (req, res) => {
  const { cachedUser } = req;
  try {
    const { id, type } = req.params;

    cachedUser.isAnonymous = !!cachedUser.isAnonymous;

    if ((type !== 'tv' && type !== 'movie') || id.trim() === '') {
      throw new Error('Search error');
    }

    const data = await mediaInfoGrapper([{ id, type }], false);

    const lists = cachedUser.isAnonymous
      ? [] : await listsHelpers.getListJSON(cachedUser, cachedUser);

    const hasList = lists.length !== 0;

    res.render('media/media', {
      media: data[0],
      type,
      cachedUser,
      options: lists,
      hasList,
      isLogged: !cachedUser.isAnonymous,
    });
  } catch (error) {
    res.status(404).render('404', { error, cachedUser });
  }
};

const seen = async (req, res) => {
  const { cachedUser } = req;
  let { id } = req.params;
  try {
    const arr = [...cachedUser.seen];
    const seenIds = arr.map(obj => obj.id);
    id = parseInt(id, 10);
    if (seenIds.includes(id)) {
      cachedUser.seen = cachedUser.seen.filter(obj => obj.id !== id);
    } else {
      cachedUser.seen = cachedUser.seen.concat({ id });
    }

    await cachedUser.save();
    res.redirect(req.header('Referer'));
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  addToList,
  deleteFromList,
  search,
  view,
  seen,
};
