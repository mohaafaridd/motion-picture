/* eslint-disable no-underscore-dangle */
const List = require('../../models/list');
const User = require('../../models/user');

const getListJSON = async (req) => {
  const { nickname } = req.params;
  const user = await User.findOne({ nickname });
  let lists = await List.find({ owner: user._id });

  if (req.user._id.toString() !== user._id.toString()) {
    lists = lists.filter(list => list.public);
  }

  lists = lists.map((list) => {
    return {
      id: list.id,
      name: list.name,
      owner: nickname,
      public: list.public,
    };
  });

  return lists;
};

module.exports = {
  getListJSON,
};
