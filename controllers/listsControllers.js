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
  res.render('lists/add', { name: req.user.name });
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
    res.status(400).send();
  }
};

const getList = async (req, res) => {
  try {
    const { id, nickname } = req.params;
    const user = await User.findOne({ nickname });
    const list = await List.findOne({ id, owner: user._id });

    if (!list.public && list.owner.toString() !== req.user._id.toString()) {
      throw new Error();
    }

    await list.populate('content').execPopulate();
    res.render('lists/list', { user, list, content: list.content });
  } catch (error) {
    res.status(404).send();
  }
};

const getLists = async (req, res) => {
  try {
    const lists = await listsHelpers.getListJSON(req);

    res.render('lists/mylists', { name: req.user.name, lists });
  } catch (error) {
    res.status(404);
  }
};

const deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findOne({ id, owner: req.user._id });
    // const list = await req.user.remove();
    await list.remove();
    res.redirect(`/users/${req.user.nickname}/lists`);
  } catch (error) {
    res.send(error.message);
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
};
