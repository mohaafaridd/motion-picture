/* eslint-disable no-underscore-dangle */
const List = require('../../models/list');
const User = require('../../models/user');

const getListJSON = async (req, source) => {
  let lists = [];

  try {
    const { nickname } = req[source];
    const user = await User.findOne({ nickname });

    if (user === null) {
      return [];
    }

    lists = await List.find({ owner: user._id });

    if (req.user._id.toString() !== user._id.toString()) {
      lists = lists.filter(list => list.public);
    }

    lists = lists.map(list => ({
      id: list.id,
      name: list.name,
      owner: nickname,
      public: list.public,
      description: list.description,
    }));
  } catch (error) {
    throw new Error('No user');
  }

  return lists;
};

module.exports = {
  getListJSON,
};
