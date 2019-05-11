/* eslint-disable no-underscore-dangle */
const Media = require('../models/media');
const List = require('../models/list');

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

module.exports = {
  addToList,
  deleteFromList,
};
