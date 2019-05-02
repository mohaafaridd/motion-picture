/* eslint-disable no-underscore-dangle */
const axios = require('axios');
const { mapData } = require('./helpers/searchHelpers');
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
  const media = new Media(req.body);
  try {
    await media.save();
    res.status(200).send(media);
  } catch (e) {
    res.status(400).send(e);
  }
};

const postList = async (req, res) => {
  try {
    const list = new List({
      ...req.body,
      owner: req.user._id,
    });

    await list.save();

    res.status(201).send(list);
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
    res.send(list.content);
  } catch (error) {
    res.status(404).send();
  }
};

const getLists = async (req, res) => {
  const { nickname } = req.params;
  const user = await User.findOne({ nickname });
  let lists = await List.find({ owner: user._id });

  if (req.user._id.toString() !== user._id.toString()) {
    lists = lists.filter(list => list.public);
  }

  res.send(lists);
};

module.exports = {
  getTopMovies,
  addToList,
  postList,
  getList,
  getLists,
  getAddList,
};
