/* eslint-disable no-underscore-dangle */
const axios = require('axios');
const { mapData } = require('./helpers/searchHelpers');
const listsHelpers = require('./helpers/listsHelpers');
const Media = require('../models/media');
const List = require('../models/list');
const User = require('../models/user');

const getTopMovies = async (req, res) => {
  try {
    const link = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`;
    const result = await axios.get(link);
    const { results } = result.data;
    const mappedData = mapData(results);

    res.send(mappedData);
  } catch (error) {
    res.send(error);
  }
};

const getAddList = (req, res) => {
  try {
    res.render('lists/add', { name: req.user.name });
  } catch (error) {
    res.redirect('/', 400);
  }
};

const addToList = async (req, res) => {
  // req.body must contain owner
  try {
    req.body.owner = await List.findOne({ name: req.body.owner });
    const duplicate = await Media.findOne({
      title: req.body.title,
      owner: req.body.owner,
    });

    if (duplicate) {
      throw new Error('duplicated movie in same list');
    }
    const media = new Media(req.body);

    await media.save();
    res.status(200).redirect(`/users/${req.user.nickname}/lists/${req.body.owner.id}`);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const postList = async (req, res) => {
  try {
    req.body.public = !!req.body.public;

    const list = new List({
      ...req.body,
      owner: req.user._id,
    });

    await list.save();

    res.status(201).redirect(`/users/${req.user.nickname}/lists`);
  } catch (error) {
    res.status(400).redirect(`/users/${req.user.nickname}/lists`);
  }
};

const getList = async (req, res) => {
  try {
    const { id, nickname } = req.params;
    const user = await User.findOne({ nickname });
    const list = await List.findOne({ id, owner: user._id });
    const isOwner = list.owner.toString() === req.user._id.toString();
    if (!list.public && list.owner.toString() !== req.user._id.toString()) {
      throw new Error();
    }

    await list.populate('content').execPopulate();
    // res.send(list.content);
    res.render('lists/list', {
      user,
      list,
      content: list.content,
      isOwner,
    });
  } catch (error) {
    res.status(404).redirect(`/users/${req.user.nickname}/lists`);
  }
};

const getLists = async (req, res) => {
  try {
    const { nickname } = req.params;
    const user = await User.findOne({ nickname });
    const lists = await listsHelpers.getListJSON(req, 'params');
    const isOwner = req.user._id.toString() === user._id.toString();
    res.render('lists/mylists', { name: user.name, lists, isOwner });
  } catch (error) {
    res.status(404).redirect('/');
  }
};

const deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findOne({ id, owner: req.user._id });
    const content = await Media.find({ owner: list._id });
    const deletePromises = content.map(media => media.remove());
    await Promise.all(deletePromises);
    await list.remove();
    // await content.forEach(media => media.remove);
    // await Promise.all(content.forEach(media => media.remove()));
    res.redirect(`/users/${req.user.nickname}/lists`);
  } catch (error) {
    res.status(400).redirect(`/users/${req.user.nickname}/lists`);
  }
};

const deleteFromList = async (req, res) => {
  try {
    const { listid, mediaid } = req.body;

    const list = await List.findOne({ id: listid });
    const media = await Media.findOne({ owner: list._id, id: mediaid });

    await media.remove();
    res.redirect(`/users/${req.user.nickname}/lists`);

  } catch (error) {
    res.redirect('/');

  }
};

module.exports = {
  getTopMovies,
  addToList,
  postList,
  getList,
  getLists,
  getAddList,
  deleteList,
  deleteFromList,
};
