/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
// Models
const User = require('../models/user');
const Media = require('../models/media');
// Helpers
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

    if (!cachedUser.isAnonymous) {
      const seen = cachedUser.seen.map(e => parseInt(e.id, 10));
      lists = await Promise.all(lists.map(async (list) => {
        const media = await Media.find({ owner: list._id });
        const ids = media.map(e => parseInt(e.id, 10));
        const seenInList = ids.filter(id => seen.includes(id));
        const watchPercentage = isNaN(seenInList.length / ids.length * 100)
          ? 0 : seenInList.length / ids.length * 100;
        return { ...list, watchPercentage };
      }));
    }

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
    res.render('404', { error, cachedUser });
  }
};

module.exports = {
  // postSignout,
  getUser,
};
