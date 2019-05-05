/* eslint-disable no-underscore-dangle */
const Media = require('../models/media');
const List = require('../models/list');
const User = require('../models/user');
const { mapData } = require('../controllers/helpers/searchHelpers');

const getAddList = (req, res) => {
  try {
    const { user } = req;
    res.render('lists/add', { user });
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
    console.log(e.message);
    res.status(400).redirect(req.header('Referer'));
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
    res.status(201).redirect(`/users/${req.user.nickname}`);
  } catch (error) {
    res.status(400).redirect(req.header('Referer'));
  }
};

const getList = async (req, res) => {
  const { id, nickname } = req.params;
  const { user } = req;
  const owner = await User.findOne({ nickname });
  const list = await List.findOne({ id, owner: owner._id });
  const isOwner = list.owner.toString() === req.user._id.toString();

  try {
    if (!list.public && list.owner.toString() !== req.user._id.toString()) {
      throw new Error();
    }

    await list.populate('content').execPopulate();

    let content = mapData(list.content);

    // console.log(content);
    if (!user.isAnonymous) {
      const seenList = user.seen.map(obj => obj.id);
      content = content.map(media => ({ ...media, seen: seenList.includes(media.id) }));
    }

    // res.send(list.content);
    res.render('lists/list', {
      owner,
      list,
      content,
      isOwner,
      user,
    });
  } catch (error) {
    res.status(404).redirect(`/users/${nickname}`);
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
    res.redirect(req.header('Referer'));
  } catch (error) {
    res.status(400).redirect(req.header('Referer'));
  }
};

const deleteFromList = async (req, res) => {
  const { listid, mediaid } = req.body;
  try {
    const list = await List.findOne({ id: listid });
    const media = await Media.findOne({ owner: list._id, id: mediaid });
    await media.remove();
    res.redirect(`/users/${req.user.nickname}/lists/${listid}`);
  } catch (error) {
    res.redirect();
  }
};

module.exports = {
  addToList,
  postList,
  getList,
  getAddList,
  deleteList,
  deleteFromList,
};
