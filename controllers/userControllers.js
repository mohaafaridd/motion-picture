/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const listsHelpers = require('../controllers/helpers/listsHelpers');

const getUser = async (req, res) => {
  const { nickname } = req.params;
  const { cachedUser } = req;
  try {
    const searchedUser = await User.findOne({ nickname });

    if (!searchedUser) {
      throw new Error('No user is found');
    }

    if (!searchedUser.avatar) {
      searchedUser.avatar = 'https://via.placeholder.com/1024';
    }

    let lists = await listsHelpers.getListJSON(cachedUser, searchedUser);

    if (lists) {
      lists = lists.map(obj => ({ ...obj, picture: obj.picture ? obj.picture : 'https://via.placeholder.com/1024' }));
    } else {
      lists = [];
    }

    const isOwner = cachedUser._id.toString() === searchedUser._id.toString();
    res.render('user/profile', {
      isProfile: true,
      title: `${searchedUser.name} Profile`,
      profile: searchedUser,
      cachedUser,
      lists,
      isLogged: !cachedUser.isAnonymous,
      isOwner,
    });
  } catch (error) {
    res.render('404', { error });
  }
};

module.exports = {
  // postSignout,
  getUser,
};
